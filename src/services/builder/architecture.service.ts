
import { ArchitectureDataApi } from './architecture.api';
import { ArchiectureDataModel } from "../../models/builder/ArchitectureDataModel";
import * as superagent from "superagent";

export class ArchitectureService implements ArchitectureDataApi {

    baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl || '/api/architectures/';
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

    async addArchitecture(arch_details: Partial<ArchiectureDataModel>): Promise<ArchiectureDataModel> {
        return superagent
            .post(this.baseUrl)
            .send(arch_details)
            .set('accept', 'application/json')
            .then(res => {
                return res.body;
            })
            .catch(err => {
                return err.response;
            });
    }

    async importBomYaml(data: FormData, overwrite: boolean): Promise<object> {
        return superagent
            .post(`${this.baseUrl}/boms/import${overwrite ? "?overwrite=true" : ""}`)
            .send(data)
            .set('accept', 'application/json')
            .then(res => {
                return res.body;
            })
            .catch(err => {
                return err.response;
            });
    }

    async uploadDiagrams(arch_id: string, data: FormData): Promise<any> {
        return superagent
            .post(`${this.baseUrl}/${arch_id}/diagram`)
            .send(data)
            .set('accept', 'application/json')
            .then(res => {
                return res.body;
            })
            .catch(err => {
                return err.response;
            });
    }

    async updateArchitecture(archiId: string, arch_details: any): Promise<ArchiectureDataModel> {
        return superagent
            .patch(this.baseUrl + "/" + archiId)
            .send(arch_details)
            .set('accept', 'application/json')
            .then(res => {
                console.log(res.status);
                return res.body;
            })
            .catch(err => {
                return err.response;
            });
    }
}


