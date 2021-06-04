
import { ControlsDataApi } from './controls.api';
import { ControlsDataModel } from "../../models/controls/ControlsDataModel";
import * as superagent from "superagent";

export class ControlsData implements ControlsDataApi {

    baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl || '/api/controls';
    }

    async getControls(): Promise<ControlsDataModel[]> {
        let filter = {
            include: ["nist", "controlDetails"]
        }
        return superagent
            .get(`${this.baseUrl}?filter=${encodeURIComponent(JSON.stringify(filter))}`)
            .set('accept', 'application/json')
            .then(res => {
                console.log(res.body);
                return res.body || [];
            });
    }
    async getControlsDetails(controlId: string, filter: object): Promise<ControlsDataModel> {
        return superagent
            .get(`${this.baseUrl}/${controlId}?filter=${encodeURIComponent(JSON.stringify(filter))}`)
            .set('accept', 'application/json')
            .then(res => {
                return res.body || {};
            })
            .catch(err => {
                return err
            })
    }
}


