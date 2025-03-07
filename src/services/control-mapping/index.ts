import {ControlMappingApi} from "@/services/control-mapping/control-mapping.api";
import {ControlMappingRest} from "@/services/control-mapping/control-mapping.rest";

export * from './control-mapping.api';

let _instance: ControlMappingApi;
export const controlMappingApi = (): ControlMappingApi => {
    if (_instance) {
        return _instance
    }

    return _instance = new ControlMappingRest()
}
