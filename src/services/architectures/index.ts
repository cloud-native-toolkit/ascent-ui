import {ArchitecturesApi} from ".";
import {ArchitecturesRest} from "@/services/architectures/architectures.rest";

export * from './architectures.api'

let _instance: ArchitecturesApi
export const architecturesApi = (): ArchitecturesApi => {
    if (_instance) {
        return _instance
    }

    return _instance = new ArchitecturesRest()
}
