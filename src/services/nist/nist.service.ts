
import { NistDataApi } from './nist.api';
import { NistDataModel } from "../../models/nist/NistDataModel";
import * as superagent from "superagent";

export class NistData implements NistDataApi {

    baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl || '/nist/';
    }

    async getNist(): Promise<NistDataModel[]> {
        return superagent
            .get(this.baseUrl)
            .set('accept', 'application/json')
            .then(res => {
                return res.body || [];
            });
    }
    async getNistDetails(controlId: string): Promise<NistDataModel> {
        return superagent
            .get(this.baseUrl + controlId)
            .set('accept', 'application/json')
            .then(res => {
                return res.body || {};
            });
    }
}
