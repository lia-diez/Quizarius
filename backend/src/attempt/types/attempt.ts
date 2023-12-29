import { UUID } from "crypto";

export class AttemptInfo {
    id: UUID;
    quizId: UUID;
    userId: UUID;
    startedAt: Date;
    finishedAt: Date;
    answers: AttemptAnswer[];
}

export class AttemptAnswer {
    id: UUID;
    questionId: UUID;
    options: (string | UUID)[];
    // maybe i should add something like isVerified: boolean?
}