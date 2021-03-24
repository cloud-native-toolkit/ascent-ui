
import { ControlsDataApi } from './controls.api';
import { ControlsDataModel } from "../../models/controls/ControlsDataModel";
import * as superagent from "superagent";

export class ControlsData implements ControlsDataApi {

    baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl || '/controls/';
    }

    async getControls(): Promise<ControlsDataModel[]> {
        return superagent
            .get(this.baseUrl)
            .set('accept', 'application/json')
            .then(res => {
                return res.body || [];
            });
    }
    async getControlsDetails(controlId: string): Promise<ControlsDataModel> {
        return superagent
            .get(this.baseUrl + controlId)
            .set('accept', 'application/json')
            .then(res => {
                return res.body || {};
            });
    }
}


