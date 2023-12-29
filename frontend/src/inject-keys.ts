import {ComputedRef, InjectionKey, Ref} from "vue";
import {accountData, accountDataSetter} from "./types";

export const accountKey = Symbol() as InjectionKey<{
    data: Ref<accountData>,
    set: accountDataSetter,
    logout: () =>void,
    login: () => void
    isTeacher:  ComputedRef<boolean>
}>