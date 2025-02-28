import {atom} from "jotai";
import {AtomWithQueryResult} from "jotai-tanstack-query";

import {automationCatalogAtom} from "@/atoms/automation.atom";
import {Bom, Catalog} from "@/models";

export const softwareOptionsAtom = atom(
    async get => {
        const result: AtomWithQueryResult<Catalog> = get(automationCatalogAtom)

        return {
            ...result,
            data: (result?.data?.boms || []).filter(bom => bom.category === 'software' && (bom.cloudProvider === 'multi' || bom.cloudProvider === undefined)) || [],
        }
    }
)

export const softwareAtom = atom<Bom[]>([]);

export const addSoftwareAtom = atom(
    get => get(softwareAtom),
    (get, set, software: Bom) => {
        set(softwareAtom, [...get(softwareAtom), software])
    }
)
