import {Controls} from "../../models";
import {ControlsApi} from ".";
import {BaseRest} from "@/services/base-rest";


export class ControlsRest extends BaseRest<Controls> implements ControlsApi {
    constructor() {
        super('/api/controls');
    }
}
