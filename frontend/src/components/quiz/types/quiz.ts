export type QuizInfo = {
    id: string
    groupId: string 
    deadLine: Date
    questionCount: number
    retries: number
    timeLimitHours: number
    timeLimitMinutes: number
    name: string
}

export type QuizQuestionOption = {
    id: string
    isCorrect: boolean
    value: string
}

export type QuizQuestion = {
    id: string
    isOpen: boolean
    isMultiChoice: boolean
    options: QuizQuestionOption[] | null
    value: string
}

export type Quiz = {
    id: string
    info: QuizInfo
    questions: QuizQuestion[]
}

