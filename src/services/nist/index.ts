import {NistApi} from "@/services/nist/nist.api";
import {NistRest} from "@/services/nist/nist.rest";

export * from './nist.api'

let _instance: NistApi
export const nistApi = (): NistApi => {
    if (_instance) {
        return _instance
    }

    return _instance = new NistRest()
}
