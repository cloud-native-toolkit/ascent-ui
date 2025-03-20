import {atom, useAtomValue} from "jotai";
import {loadable} from "jotai/utils";
import {atomWithQuery} from "jotai-tanstack-query";
import {v4 as uuidv4} from "uuid";

import {BaseSolution, Bom, CloudProviderMetadata, FlavorMetadata, Solution, UserConfig} from "@/models";
import {flavorAtom} from "@/atoms/flavors.atom";
import {platformAtom} from "@/atoms/platform.atom";
import {softwareAtom} from "@/atoms/software.atom";
import {storageAtom} from "@/atoms/storage.atom";
import {currentUserEmailAtom} from "@/atoms/user.atom";
import {solutionsApi} from "@/services";

const baseCurrentSolutionAtom = atom<Promise<Solution | undefined>>(Promise.resolve(undefined))

export const currentSolutionAtom = atom(
    get => get(baseCurrentSolutionAtom),
    async (_, set, solutionOrSolutionId?: Solution | string) => {
        if (!solutionOrSolutionId) {
            set(baseCurrentSolutionAtom, Promise.resolve(undefined));
        } else if (typeof solutionOrSolutionId === "string") {
            set(baseCurrentSolutionAtom, solutionsApi().get(solutionOrSolutionId));
        } else {
            set(baseCurrentSolutionAtom, Promise.resolve(solutionOrSolutionId));
        }
    }
)

export const currentSolutionAtomLoadable = loadable(currentSolutionAtom)

const filterSolution = (userConfig?: UserConfig) => {
    return (solution: Solution): boolean => {
        const solId = solution.id?.toLowerCase();
        const solName = solution.name?.toLowerCase();
        const solDesc = solution.short_desc?.toLowerCase();
        const provider = solution.platform ?? '';

        const restrictedProviders = [];
        if (userConfig?.ibmContent) {
            if (solId?.includes('ibm') || solName.includes('ibm')) return false;
            restrictedProviders.push('ibm');
            restrictedProviders.push('ibm-cp');
        }
        if (!userConfig?.azureContent) {
            if (solId?.includes('azure') || solName.includes('azure') || solDesc.includes('azure')) return false;
            restrictedProviders.push('azure');
        }
        if (!userConfig?.awsContent) {
            if (solId?.includes('aws') || solName.includes('aws') || solDesc.includes('aws')) return false;
            restrictedProviders.push('aws');
        }

        return !restrictedProviders.includes(provider);
    }
}

export const solutionsAtom = atomWithQuery(() => ({
    queryKey: ['solutions'],
    queryFn: async () => solutionsApi().list(),
}))

export const userSolutionsAtom = atomWithQuery(get => ({
    queryKey: ['solutions', get(currentUserEmailAtom).data],
    queryFn: ({ queryKey: [, email]}) => solutionsApi().listUserSolutions(email as string),
}))

export const useFilteredSolutions = (email?: string, userConfig?: UserConfig) => {
    const result = useAtomValue(email ? userSolutionsAtom : solutionsAtom);

    return {
        ...result,
        data: (result?.data || []).filter(filterSolution(userConfig))
    }
}

export const baseNewSolutionAtom = atom<BaseSolution | undefined>()
export const newSolutionAtom = atom(
    get => {
        const newSolution = get(baseNewSolutionAtom)
        const software = get(softwareAtom)
        const platform = get(platformAtom)
        const flavor = get(flavorAtom)
        const storage = get(storageAtom)

        return Object.assign(initializeSolution({software, platform, flavor, storage}), newSolution)
    },
    (_, set, newSolution: BaseSolution | undefined) => {
        set(baseNewSolutionAtom, newSolution)
    }
)

export const initializeSolutionShortDesc = ({software, platform}: {software: Bom[], platform?: CloudProviderMetadata}): string => {
    return `Solution based on ${software?.map(sw => (`${sw.displayName ?? sw.name}`)).join(', ')} on ${platform?.displayName}.`
}

export const initializeSolutionLongDesc = ({flavor, platform, software, storage}: {flavor?: FlavorMetadata, platform?: CloudProviderMetadata, software: Bom[], storage?: Bom}): string => {
    return `Solution based on ${software?.map(sw => (`${sw.displayName ?? sw.name}`)).join(', ')} in ${flavor?.displayName} reference architecture deployed on ${platform?.displayName} with ${storage?.displayName} as storage option.`
}

export const initializeSolution = ({flavor, platform, software, storage}: {flavor?: FlavorMetadata, platform?: CloudProviderMetadata, software: Bom[], storage?: Bom}): BaseSolution => ({
    id: uuidv4(),
    name: '',
    short_desc: initializeSolutionShortDesc({software, platform}),
    long_desc: initializeSolutionLongDesc({flavor, platform, software, storage}),
    public: false,
    techzone: false,
});

