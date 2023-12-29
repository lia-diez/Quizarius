import { UUID } from "crypto"

export interface QuizInfo {
    id: UUID
    groupId: UUID
    questionCount: number
    deadLine: Date | null
    retries: number | null
    timeLimitHours: number | null
    timeLimitMinutes: number | null
    name: string
    isVisible: boolean
}

export interface QuizQuestionOption {
    id: UUID
    isCorrect: boolean
    value: string
}

export interface QuizQuestion {
    id: UUID
    isOpen: boolean
    isMultiChoice: boolean
    options: QuizQuestionOption[] | null
    value: string
}

export interface Quiz {
    id: UUID
    info: QuizInfo
    questions: QuizQuestion[]
}


