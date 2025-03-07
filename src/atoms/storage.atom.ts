import {atom} from "jotai";
import {automationCatalogAtom} from "@/atoms/automation.atom";
import {AtomWithQueryResult} from "jotai-tanstack-query";
import {Bom, Catalog, CloudProviderMetadata} from "@/models";
import {platformAtom} from "@/atoms/platform.atom";

export const storageOptionsAtom = atom(
    async get => {
        const platform: CloudProviderMetadata | undefined = get(platformAtom)

        const result: AtomWithQueryResult<Catalog> = get(automationCatalogAtom)

        return {
            ...result,
            data: (result?.data?.boms || []).filter(bom => bom.category === 'storage' && bom.cloudProvider === platform?.name) || [],
        }
    }
)

export const storageAtom = atom<Bom | undefined>()
