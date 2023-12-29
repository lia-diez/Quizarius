import { randomUUID } from "crypto";
import { PostQuizDto } from "../types/post-quiz.dto";
import { Quiz } from "../types/quiz";


export const dtoToQuiz = (dto: PostQuizDto): Quiz => {
    const quizId = randomUUID();
    return {
        id: quizId,
        info: {
            id: quizId,
            groupId: dto.info.groupId,
            questionCount: dto.questions.length,
            deadLine: dto.info.deadLine,
            retries: dto.info.hasRetries ? dto.info.retries : null,
            timeLimitHours: dto.info.hasTimeLimit ? dto.info.timeLimitHours : null,
            timeLimitMinutes: dto.info.hasTimeLimit ? dto.info.timeLimitMinutes : null,
            name: dto.info.name,
            isVisible: dto.info.isVisible
        },

        questions: dto.questions.map(question => {
            return {
                id: randomUUID(),
                isOpen: question.value.isOpen,
                isMultiChoice: question.value.options?.filter(o => o.correct).length > 1,
                options: !question.value.isOpen ? question.value.options.map(option => {
                    return {
                        id: randomUUID(),
                        isCorrect: option.correct,
                        value: option.value
                    }
                }) : null,
                value: question.value.value
            }
        })
    }
}

export const removeAnswers = (quiz: Quiz): Quiz => {
    return;
}