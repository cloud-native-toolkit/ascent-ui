import { atom } from "jotai";
import {tokenApi} from "@/services";
import {decodeFromBase64} from "next/dist/build/webpack/loaders/utils";

export type CopyTokenIcon = "copy" | "complete" | "fetch";
const baseCopyTokenIconAtom = atom<CopyTokenIcon>("copy");

export const copyTokenIconAtom = atom(
    (get) => get(baseCopyTokenIconAtom),
    async (get, set) => {
        set(baseCopyTokenIconAtom, "fetch")

        try {
            const token = await tokenApi().getToken()

            await navigator.clipboard.writeText('' + decodeFromBase64(token.token))
            set(baseCopyTokenIconAtom, "complete");

            setTimeout(() => set(baseCopyTokenIconAtom, "copy"), 2000);
        } catch (error) {
            console.error(error);
            set(baseCopyTokenIconAtom, "copy")
        }
    }
);
