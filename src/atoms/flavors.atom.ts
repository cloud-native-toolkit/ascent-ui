import {atom} from "jotai";
import {automationCatalogAtom} from "@/atoms/automation.atom";
import {FlavorMetadata} from "@/models";

export const flavorsAtom = atom(
    get => {
        const result = get(automationCatalogAtom)

        return {
            ...result,
            data: result?.data?.metadata?.flavors || [],
        }
    }
)

export const flavorAtom = atom<FlavorMetadata | undefined>()
