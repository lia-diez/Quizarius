import { UUID } from "crypto"

export interface Group {
    id: UUID
    ownerId: UUID
    ownerLogin: string
    name: string
    description: string
}

export interface GroupUser {
    id: UUID
    login: string
    role: 'teacher' | 'student'
}

export interface JoinRequest {
    id: UUID
    userId: UUID
    groupId: UUID
    userLogin: string
}