import {AutomationApi} from "./automation.api";
import {AutomationRest} from "./automation.rest";

export * from './automation.api'

let _instance: AutomationApi
export const automationApi = (): AutomationApi => {
    if (_instance) {
        return _instance
    }

    return _instance = new AutomationRest()
}
