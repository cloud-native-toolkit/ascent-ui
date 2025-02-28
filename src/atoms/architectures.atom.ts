import {atomWithQuery} from "jotai-tanstack-query";
import {architecturesApi} from "@/services";

export const architecturesAtom = atomWithQuery(() => ({
  queryKey: ['architectures'],
  queryFn: async () => architecturesApi().list()
}));
