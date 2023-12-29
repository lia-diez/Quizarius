import {accountData} from "../types";

export const saveAuth = (jwt: string)=> {
    if (!jwt) return;
    localStorage.setItem('bearer', jwt)
    return;

}

export const loadAuth = (): string=> {
     return localStorage.getItem('bearer')
}

export const deleteAuth = (): void => {
    localStorage.removeItem('bearer')
}