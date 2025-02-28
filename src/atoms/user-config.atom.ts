import {atom} from "jotai";
import {atomWithMutation} from "jotai-tanstack-query";

import {currentUserAtom, currentUserEmailAtom} from "@/atoms/user.atom";
import {defaultUserConfig, User, UserConfig} from "@/models";
import {usersApi} from "@/services";

export const userConfigAtom = atom(
    async (get) => {
        const result = get(currentUserAtom)

        return {
            ...result,
            data: result.data?.config || defaultUserConfig()
        }
    },
)
export const updateUserConfigAtom = atomWithMutation((get) => ({
    mutationKey: ['currentUser'],
    mutationFn: async ({config}: {config: UserConfig}) => {
        const {data: email} = get(currentUserEmailAtom)

        if (email) {
            const user: User = await usersApi().update(email, {config});

            return user.config;
        }

        return config;
    }
}))
