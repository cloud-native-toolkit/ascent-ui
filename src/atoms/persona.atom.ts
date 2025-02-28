import {atom} from "jotai";
import {UseCaseMetadata} from "@/models";

export const personaAtom = atom<UseCaseMetadata | undefined>();
