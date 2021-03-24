
import { ArchitectureDataApi } from './architecture.api';
import { ArchiectureDataModel } from "../../models/builder/ArchitectureDataModel";
import * as superagent from "superagent";

export class ArchitectureService implements ArchitectureDataApi {

    baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl || '/architectures/';
    }

    async getArchitectures(): Promise<ArchiectureDataModel[]> {
        return superagent
            .get(this.baseUrl )
            .set('accept', 'application/json')
            .then(res => {
                return res.body || [];
            });

    }

    async getArchitectureById(archiId: string): Promise<ArchiectureDataModel> {
        return superagent
            .get(this.baseUrl + archiId)
            .set('accept', 'application/json')
            .then(res => {

                return res.body;
            });
    }
}


