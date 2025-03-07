import {ControlsApi} from "./controls.api";
import {ControlsRest} from "./controls.rest";

export * from './controls.api';

let _instance: ControlsApi;
export const controlsApi = (): ControlsApi => {
    if (_instance) {
        return _instance
    }

    return _instance = new ControlsRest()
}
