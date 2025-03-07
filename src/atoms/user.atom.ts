import {atom} from "jotai";
import {atomWithQuery} from "jotai-tanstack-query";

import {User} from "@/models";
import {usersApi} from "@/services";

export const currentUserAtom = atomWithQuery<User | undefined>(() => ({
    queryKey: ['currentUser'],
    queryFn: async () => usersApi().getCurrentUser()
}))

export const currentUserEmailAtom = atom(get => {
    const result = get(currentUserAtom)

    return {
        ...result,
        data: result.data?.email
    }
})
