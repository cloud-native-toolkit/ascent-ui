
import { SolutionsDataApi } from './solutions.api';
import { SolutionDataModel } from "../../models/builder/SolutionDataModel";
import * as superagent from "superagent";

export class SolutionsService implements SolutionsDataApi {

    baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl || '/api/solutions';
    }

    async getSolutions(): Promise<SolutionDataModel[]> {
        return superagent
            .get(this.baseUrl )
            .set('accept', 'application/json')
            .then(res => {
                return res.body || [];
            });
    }

    async getSolutionById(archiId: string): Promise<SolutionDataModel> {
        return superagent
            .get(`${this.baseUrl}/${archiId}?filter=%7B%22include%22%3A%20%5B%22owners%22%5D%7D`)
            .set('accept', 'application/json')
            .then(res => {
                return res.body;
            });
    }

    async addSolution(arch_details: Partial<SolutionDataModel>): Promise<SolutionDataModel> {
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

    async deleteSolution(arch_id: string): Promise<void> {
        return superagent
            .delete(`${this.baseUrl}/${arch_id}`)
            .set('accept', 'application/json')
            .then(res => {
                return res;
            })
            .catch(err => {
                return err.response;
            });
    }

    async updateSolution(archiId: string, arch_details: any): Promise<SolutionDataModel> {
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


