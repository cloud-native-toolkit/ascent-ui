import {ServicesApi} from "@/services/services/services.api";
import {ServicesRest} from "@/services/services/services.rest";

export * from './services.api'

let _instance: ServicesApi
export const servicesApi = (): ServicesApi => {
    if (_instance) {
        return _instance
    }

    return _instance = new ServicesRest()
}
