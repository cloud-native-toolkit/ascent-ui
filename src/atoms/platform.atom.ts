import {atom} from "jotai";
import {Catalog, CloudProviderMetadata} from "@/models";
import {AtomWithQueryResult} from "jotai-tanstack-query";
import {automationCatalogAtom} from "@/atoms/automation.atom";

export const platformAtom = atom<CloudProviderMetadata | undefined>();

export const cloudProvidersAtom = atom(
    async get => {
        const result: AtomWithQueryResult<Catalog> = get(automationCatalogAtom)

        return {
            ...result,
            data: result?.data?.metadata?.cloudProviders || [],
        }
    }
)
