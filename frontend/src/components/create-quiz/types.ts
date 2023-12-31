export type createQuizQuestion = {
    value?: string
    qid: string
    isOpen: boolean;
    options?: createQuizQuestionOption[]
}

export type createQuizQuestionOption = {
    value?: string
    qid: string
    correct: boolean
}

export type createQuiz = {
    info: createQuizInfo
    questions: {value: createQuizQuestion}[]
}

export type createQuizInfo = {
    name: string | null
    deadLine: Date | null
    hasRetries: boolean
    retries: number
    hasTimeLimit: boolean
    timeLimitHours: number
    timeLimitMinutes: number
    groupId: string | null
    isVisible: boolean
}