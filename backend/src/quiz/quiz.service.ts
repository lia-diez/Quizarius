import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { User } from 'src/auth/types/user';
import { GroupService } from 'src/group/group.service';
import { GroupUser } from 'src/group/types/group';
import { PrismaService } from 'src/prisma/prisma.service';
import { Quiz, QuizInfo } from './types/quiz';

@Injectable()
export class QuizService {
    constructor(private readonly prismaService: PrismaService, private readonly groupService: GroupService) { }

    public async postQuiz(userId: string, quiz: Quiz) {
        // check if group exists and user is a owner
        await this.groupService.verifyGroupAndOwner(userId, quiz.info.groupId);

        await this.prismaService.quiz.create({
            data: {
                id: quiz.id,
                groupId: quiz.info.groupId,
                deadLine: quiz.info.deadLine,
                retries: quiz.info.retries,
                timeLimitHours: quiz.info.timeLimitHours,
                timeLimitMinutes: quiz.info.timeLimitMinutes,
                name: quiz.info.name,
                isVisible: quiz.info.isVisible,
                questions: {
                    create: quiz.questions.map(question => {
                        return {
                            id: question.id,
                            isOpen: question.isOpen,
                            isMultiChoice: question.isMultiChoice,
                            // options can be null, so we need to return options or null
                            options: question.isOpen ? undefined : {
                                create: question.options.map(option => {
                                    return {
                                        id: option.id,
                                        isCorrect: option.isCorrect,
                                        value: option.value
                                    }
                                })
                            },
                            value: question.value
                        }
                    })
                }
            }
        });
    }

    public async findQuiz(user: User, quizId: string): Promise<Quiz> {
        if (user.role === 'student')
            return await this.getQuizForStudent(user.id, quizId);

        const quiz = await this.getQuizById(quizId);

        if (!quiz) {
            throw new BadRequestException('Quiz not found');
        }

        await this.groupService.verifyGroupAndOwner(user.id, quiz.info.groupId);
        return quiz;
    }

    private async getQuizForStudent(userId: string, quizId: string): Promise<Quiz> {
        const quiz = await this.getQuizByUserAndId(userId, quizId);

        if (!quiz) {
            throw new BadRequestException('Quiz not found');
        }

        if (quiz.info.retries && quiz.info.retries <= 0) {
            throw new ForbiddenException('Max attempt count reached');
        }

        quiz.questions.forEach(question => {
            question.options.forEach(option => {
                option.isCorrect = null;
            });
        });

        await this.groupService.verifyGroupAndMember(userId, quiz.info.groupId);
        return quiz;
    }


    public async getQuizzesByGroup(userId: string, groupId: string): Promise<QuizInfo[]> {
        // check if user is a owner or member of the existing group
        await this.groupService.verifyGroupAndMember(userId, groupId);

        const quizzesIds = await this.prismaService.quiz.findMany({
            where: {
                groupId: groupId
            },
            select: {
                id: true
            }
        });

        const groupUser = await this.groupService.getGroupUserById(userId);

        return Promise.all(quizzesIds.map(quiz => this.getQuizInfo(groupUser, quiz.id)));        
    }

    public async getQuizzesInfo(userId: string): Promise<QuizInfo[]> {
        // format userId to GroupUser
        const groupUser = await this.groupService.getGroupUserById(userId);
        // get all groups where user is a member
        const groups = await this.groupService.getGroupsByUser(groupUser);

        return (await (Promise.all(groups.map(group => this.getQuizzesByGroup(userId, group.id))))).flat();
    }

    private async getQuizInfo(user: GroupUser, quizId: string) : Promise<QuizInfo> {
        // calculate question count for each quiz and return them all
        if (user.role === 'student')
            return (await this.getQuizForStudent(user.id, quizId)).info;
        else
            return (await this.getQuizById(quizId)).info;
    }

    public async getQuizByUserAndId(userId: string, quizId: string): Promise<Quiz> {
        const quiz = await this.prismaService.quiz.findUnique({
            where: {
                id: quizId
            },
            include: {
                questions: {
                    include: {
                        options: true
                    }
                }
            }
        });

        if (!quiz) {
            throw new BadRequestException('Quiz not found');
        }

        return {
            id: quiz.id as UUID,
            info: {
                id: quiz.id as UUID,
                groupId: quiz.groupId as UUID,
                deadLine: quiz.deadLine,
                retries: quiz.retries ? quiz.retries - await this.prismaService.userAttempt.count({
                    where: {
                        quizId: quizId,
                        userId: userId,
                        finishedAt: {
                            not: null
                        }        
                    }
                }) : null,
                timeLimitHours: quiz.timeLimitHours,
                timeLimitMinutes: quiz.timeLimitMinutes,
                name: quiz.name,
                questionCount: quiz.questions.length,
                isVisible: quiz.isVisible
            },
            questions: quiz.questions.map(question => {
                return {
                    id: question.id as UUID,
                    isOpen: question.isOpen,
                    isMultiChoice: question.isMultiChoice,
                    options: question.options.map(option => {
                        return {
                            id: option.id as UUID,
                            isCorrect: option.isCorrect,
                            value: option.value
                        }
                    }),
                    value: question.value
                }
            })
        }
    }

    public async getQuizById(quizId: string): Promise<Quiz> {
        const quiz = await this.prismaService.quiz.findUnique({
            where: {
                id: quizId
            },
            include: {
                questions: {
                    include: {
                        options: true
                    }
                }
            }
        });

        if (!quiz) {
            throw new BadRequestException('Quiz not found');
        }

        return {
            id: quiz.id as UUID,
            info: {
                id: quiz.id as UUID,
                groupId: quiz.groupId as UUID,
                deadLine: quiz.deadLine,
                retries: quiz.retries,
                timeLimitHours: quiz.timeLimitHours,
                timeLimitMinutes: quiz.timeLimitMinutes,
                name: quiz.name,
                questionCount: quiz.questions.length,
                isVisible: quiz.isVisible
            },
            questions: quiz.questions.map(question => {
                return {
                    id: question.id as UUID,
                    isOpen: question.isOpen,
                    isMultiChoice: question.isMultiChoice,
                    options: question.options.map(option => {
                        return {
                            id: option.id as UUID,
                            isCorrect: option.isCorrect,
                            value: option.value
                        }
                    }),
                    value: question.value
                }
            })
        }
    }

    public async verifyQuizAndMember(userId: string, quizId: string): Promise<Quiz> {
        const quiz = await this.getQuizById(quizId);

        if (!quiz) {
            throw new BadRequestException('Quiz not found');
        }

        // check if user is a member of the existing group
        await this.groupService.verifyGroupAndMember(userId, quiz.info.groupId);
        return quiz;
    }

    public async getQuizOwnerId(quizId: string): Promise<string> {
        const quiz = await this.getQuizById(quizId);
        const group = await this.groupService.getGroupById(quiz.info.groupId);
        return group.ownerId;
    }
}
