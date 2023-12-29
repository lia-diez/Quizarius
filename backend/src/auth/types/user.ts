import { UUID } from "crypto"

export interface User {
    id: UUID
    login: string
    hashedPassword: string
    role : 'teacher' | 'student'
}