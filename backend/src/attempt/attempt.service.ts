import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { UUID, randomUUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { QuizService } from 'src/quiz/quiz.service';
import { Quiz } from 'src/quiz/types/quiz';
import { AttemptDto } from './dto/attempt.dto';
import { AttemptInfo } from './types/attempt';

@Injectable()
export class AttemptService {
    constructor(private readonly prismaService: PrismaService, private readonly quizService: QuizService) { }

    public async startAttempt(userId: string, quizId: string): Promise<AttemptInfo> {
        // check if user has access to the quiz
        await this.quizService.verifyQuizAndMember(userId, quizId);

        // check if max attempts is not exceeded
        const quiz = await this.quizService.getQuizById(quizId);

        // check if user has already started the attempt
        const attempts = await this.prismaService.userAttempt.findMany({
            where: {
                userId: userId,
                quizId: quizId
            }
        });
        if (attempts.length > 0) {
            const lastAttempt = attempts.sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())[0];
            if (!lastAttempt.finishedAt) {
                return lastAttempt as AttemptInfo;
            }

            // check if last attempt time has expired
            const quizMaxTime = quiz.info.timeLimitMinutes + quiz.info.timeLimitHours * 60;
            if (quizMaxTime > 0 && !(lastAttempt.startedAt.getTime() + quizMaxTime * 60 * 1000 > new Date().getTime())) {
                return lastAttempt as AttemptInfo;
            }
        }

        const maxAttempts = quiz.info.retries;
        if (maxAttempts > 0) {
            const attempts = await this.prismaService.userAttempt.findMany({
                where: {
                    userId: userId,
                    quizId: quizId
                }
            });
            if (attempts.length >= maxAttempts) {
                throw new BadRequestException('Max attempts exceeded');
            }
        }

        // started - now
        const startedAt = new Date();

        const attempt = await this.prismaService.userAttempt.create({
            data: {
                id: randomUUID(),
                userId: userId,
                quizId: quizId,
                startedAt: startedAt
            }
        });

        return attempt as AttemptInfo;
    }


    // for now it is possible to submit attempt more than once
    // if i decide to prevent this, i need to check finishedAt somewhere

    public async submitAttempt(userId: string, attemptDto: AttemptDto): Promise<{ id: string }> {
        const finishedAt = new Date();
        // check if user has access to the attempt and attempt exists
        await this.verifyAttemptAndUser(userId, attemptDto.attemptId);
        const attempt = await this.getAttemptInfo(attemptDto.attemptId);

        // check if attempt is already finished
        if (attempt.finishedAt) {
            throw new BadRequestException('Attempt already finished');
        }

        const quiz = (await this.quizService.getQuizById(attempt.quizId));
        const quizMaxTime = quiz.info.timeLimitMinutes + quiz.info.timeLimitHours * 60;

        // check if attempt max time is not exceeded
        if (quizMaxTime > 0 && finishedAt.getTime() > attempt.startedAt.getTime() + quizMaxTime * 60 * 1000) {
            throw new BadRequestException('Attempt max time exceeded');
        }

        let updatedAttempt = await this.prismaService.userAttempt.update({
            where: {
                id: attempt.id
            },
            data: {
                finishedAt: finishedAt,
                answers: {
                    create: attemptDto.answers.map(answerDto => {
                        return {
                            questionId: answerDto.questionId,
                            answerOptions: {
                                create: answerDto.options.map(optionDto => {
                                    return {
                                        optionId: this.isUUID(optionDto) ? optionDto : null,
                                        openAnswer: this.isUUID(optionDto) ? null : optionDto,
                                        isCorrect: null
                                    }
                                })
                            }
                        }
                    })
                }
            }
        });

        this.checkTestAnswers(updatedAttempt.id);

        return { id: updatedAttempt.id };
    }

    private async verifyAttemptAndUser(userId: string, attemptId: string) {
        const userAttempt = await this.prismaService.userAttempt.findFirst({
            where: {
                id: attemptId
            }
        });

        if (!userAttempt) {
            throw new BadRequestException('Attempt not found');
        }

        const teacherId = await this.quizService.getQuizOwnerId(userAttempt.quizId);

        if (userAttempt.userId !== userId && teacherId !== userId) {
            throw new ForbiddenException('You are not allowed to access this attempt');
        }
    }

    public async getAttemptsByStudent(userId: string, groupId: string, studentId: string): Promise<{ attempt: AttemptInfo, quiz: Quiz }[]> {
        const attempts = await this.prismaService.userAttempt.findMany({
            where: {
                userId: studentId,
                quizId: {
                    // it also checks if teacher has access to the quiz
                    in: await this.quizService.getQuizzesByGroup(userId, groupId).then(quizzes => quizzes.map(quiz => quiz.id))
                },
                answers: {
                    some: {
                        answerOptions: {
                            some: {
                                isCorrect: null
                            }
                        }
                    }
                }
            }
        });

        const attemptsInfo = await Promise.all(attempts.map(async attempt => {
            return {
                attempt: await this.getAttemptInfo(attempt.id),
                quiz: await this.quizService.getQuizById(attempt.quizId)
            }
        }));

        return attemptsInfo;
    }

    private async getAttemptInfo(attemptId: string): Promise<AttemptInfo> {
        const userAttempt = await this.prismaService.userAttempt.findUnique({
            where: {
                id: attemptId
            }
        });

        const attemptInfo: AttemptInfo = {
            id: userAttempt.id as UUID,
            quizId: userAttempt.quizId as UUID,
            userId: userAttempt.userId as UUID,
            startedAt: userAttempt.startedAt,
            finishedAt: userAttempt.finishedAt,
            answers: await this.prismaService.attemptAnswer.findMany({
                where: {
                    attemptId: attemptId
                }
            }).then(async (answers: { id: string; attemptId: string; questionId: string; options: (string | UUID)[] }[]) => {
                const resolvedAnswers = await Promise.all(answers.map(async answer => {
                    return {
                        id: answer.id as UUID,
                        questionId: answer.questionId as UUID,
                        options: await this.prismaService.answerOption.findMany({
                            where: {
                                attemptAnswerId: answer.id
                            }
                        }).then(options => {
                            return options.map(option => option.openAnswer ? option.openAnswer : option.optionId);
                        })
                    }
                }));
                return resolvedAnswers;
            })
        }

        return attemptInfo;
    }

    public async getAttempt(userId: string, attemptId: string): Promise<{ attempt: AttemptInfo, quiz: Quiz }> {
        await this.verifyAttemptAndUser(userId, attemptId);

        const attempt = await this.getAttemptInfo(attemptId);
        const quiz = await this.quizService.getQuizById(attempt.quizId);

        return { attempt: attempt, quiz: quiz };
    }

    private isUUID(str: string): boolean {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return uuidRegex.test(str);
    }

    // this thing tests only test answers, open ones remain isCorrect: null
    private async checkTestAnswers(attemptId: string): Promise<boolean> {
        const attempt = await this.getAttemptInfo(attemptId);
        const quiz = await this.quizService.getQuizById(attempt.quizId);

        let optionsToBeUpdated = await this.prismaService.answerOption.findMany({
            where: {
                attemptAnswerId: {
                    in: attempt.answers.map(answer => answer.id)
                },
                optionId: {
                    not: null
                }
            }
        });

        const questions = quiz.questions.filter(question => !question.isOpen);

        await Promise.all(optionsToBeUpdated?.map(async option => {
            const questionId = (await this.prismaService.attemptAnswer.findUnique({
                where: {
                    id: option.attemptAnswerId
                }
            })).questionId;
            const quizOpt = questions.find(question => question.id === questionId).options.find(quizOption => quizOption.id === option.optionId);
            await this.prismaService.answerOption.update({
                where: {
                    id: option.id
                },
                data: {
                    isCorrect: quizOpt.isCorrect
                }
            });
        }));

        return true;
    }

    public async verifyAnswerOption(userId: string, attemptId: string, questionId: string, value: boolean): Promise<boolean> {
        // there is no optionId on front, so have to find the option which is openAnswer
        // this option has to be the only one in this attempt for this question
        const option = await this.prismaService.attemptAnswer.findFirst({
            where: {
                attemptId: attemptId,
                questionId: questionId,
                answerOptions: {
                    every: {
                        openAnswer: {
                            not: null
                        },
                        optionId: null
                    }
                }
            },
            include: {
                answerOptions: {
                }
            }
        });

        if (!option) {
            throw new BadRequestException('Option not found');
        }

        const optionId = option.answerOptions[0].id as UUID;

        const updatedOption = await this.prismaService.answerOption.update({
            where: {
                id: optionId
            },
            data: {
                isCorrect: value
            }
        });

        return updatedOption.isCorrect;
    }

    public async getAttemptsByStudentWithResult(userId: string, groupId: string, studentId: string): Promise<{ attempt: AttemptInfo, quiz: Quiz, grade: number }[]> {
        const attempts = await this.prismaService.userAttempt.findMany({
            where: {
                userId: studentId,
                quizId: {
                    // it also checks if teacher has access to the quiz
                    in: await this.quizService.getQuizzesByGroup(userId, groupId).then(quizzes => quizzes.map(quiz => quiz.id))
                },
                answers: {
                    every: {
                        answerOptions: {
                            every: {
                                isCorrect: {
                                    not: null
                                }
                            }
                        }
                    }
                }
            }
        });

        const attemptsInfo = await Promise.all(attempts.map(async attempt => {
            return {
                attempt: await this.getAttemptInfo(attempt.id),
                quiz: await this.quizService.getQuizById(attempt.quizId),
                grade: await this.prismaService.attemptAnswer.count({
                    where: {
                        attemptId: attempt.id,
                        answerOptions: {
                            every: {
                                isCorrect: true
                            }
                        }
                    }
                })
            }
        }));

        return attemptsInfo;
    }
}
