export interface accountData {
    login?: string | null
    id?: string | null
    role?: string | null
}

export type accountDataSetter = (login: string | null, id: string | null, role: string | null) => void