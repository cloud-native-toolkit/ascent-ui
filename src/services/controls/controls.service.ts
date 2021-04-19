
import { ControlsDataApi } from './controls.api';
import { ControlsDataModel } from "../../models/controls/ControlsDataModel";
import * as superagent from "superagent";

export class ControlsData implements ControlsDataApi {

    baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl || '/api/controls';
    }

    async getControls(): Promise<ControlsDataModel[]> {
        return superagent
            .get(this.baseUrl + "?filter=%7B%22include%22%3A%20%5B%22nist%22%5D%7D")
            .set('accept', 'application/json')
            .then(res => {
                return res.body || [];
            });
    }
    async getControlsDetails(controlId: string): Promise<ControlsDataModel> {
        return superagent
            .get(this.baseUrl + "/" + controlId)
            .set('accept', 'application/json')
            .then(res => {
                return res.body || {};
            });
    }
}


