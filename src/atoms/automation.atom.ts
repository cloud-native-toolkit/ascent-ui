import { atom } from "jotai";
import {atomWithQuery} from "jotai-tanstack-query";

import {Catalog} from "@/models";
import {automationApi} from "@/services";

export const automationCatalogAtom = atomWithQuery<Catalog>(() => ({
    queryKey: ['automation', 'catalog'],
    queryFn: async () => automationApi().getCatalog()
}))

export const useCasesAtom = atom(get => {
    const result = get(automationCatalogAtom);

    return {
        ...result,
        data: result?.data?.metadata?.useCases || []
    }
})