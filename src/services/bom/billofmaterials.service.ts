import { BillofMaterialsDataModel } from '../../models/bom/BillofMaterialsDataModel';
import { ServiceDataModel } from "../../models/services/serviceDataModel";
import { BillofMaterialsApi } from './billofmaterials.api';
import * as superagent from 'superagent';

export class BillofMaterialsService implements BillofMaterialsApi {
    baseUrl: string;
    servicebaseUrl: string;
    constructor(baseUrl: string, servicebaseUrl: string) {
        this.baseUrl = baseUrl || '/api/architectures/';
        this.servicebaseUrl = servicebaseUrl || '/api/services';
    }

    async getServices(): Promise<ServiceDataModel[]> {
        return superagent
            .get(this.servicebaseUrl)
            .set('accept', 'application/json')
            .then(res => {
                return res.body || [];
            });

    }
    async doPostBOM(archiId: string, bom_details: any): Promise<BillofMaterialsDataModel[]> {
        return superagent
            .post(this.baseUrl + archiId + '/boms')
            .send(bom_details)
            .set('accept', 'application/json')
            .then(res => {
                console.log(res.status);
                return res.body;
            })
            .catch(err => {
                return err.response;
            });
    }

    async getBOM(archiId: string, filter:any): Promise<BillofMaterialsDataModel[]> {
        let url = this.baseUrl + archiId + '/boms';
        if (filter) {
            url = url + "?filter=" + encodeURIComponent(JSON.stringify(filter));
        }
        return superagent
            .get(url)
            .set('accept', 'application/json')
            .then(res => {
                return res.body || [];
            });
    }

    async getBomComposite(archiId: string): Promise<BillofMaterialsDataModel[]> {
        return superagent
            .get('/api/boms/services/' + archiId)
            .set('accept', 'application/json')
            .then(res => {
                return res.body || [];
            });
    }

    async getBomDetails(bomId: string): Promise<BillofMaterialsDataModel> {
        return superagent
            .get(`/api/boms/${bomId}/composite`)
            .set('accept', 'application/json')
            .then(res => {
                return res.body || {};
            });
    }

    async doUpdateBOM(bomId: string, bomDetails: any): Promise<any> {
        return superagent
            .patch(`/api/boms/${bomId}`)
            .send(bomDetails)
            .set('accept', 'application/json')
            .then(res => {
                return res.body;
            })
            .catch(err => {
                return err.response;
            });
    }

    async doDeleteBOM(bomId: string): Promise<any> {
        console.log(bomId);
        return superagent
            .delete(`/api/boms/${bomId}`)
            .set('accept', 'application/json')
            .then(res => {
                return res;
            })
            .catch(err => {
                return err.response;
            });
    }

}
