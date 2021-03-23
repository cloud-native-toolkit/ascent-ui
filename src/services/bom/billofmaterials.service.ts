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
            });
    }

    async getBOM(archiId: string): Promise<BillofMaterialsDataModel[]> {
        return superagent
            .get(this.baseUrl + archiId + '/boms')
            .set('accept', 'application/json')
            .then(res => {
                /* var dataObj: { [x: string]: any; };
                 res.body.forEach((element: any) => {
                     Object.keys(element).forEach((key, index) => {
                         console.log(index + "==" + key);
                     });
                     console.log(dataObj);
                 });*/

                return res.body || [];
            });
    }

    async doUpdateBOM(archId: string, service_details: any): Promise<BillofMaterialsDataModel[]> {
        return superagent
            .patch(this.baseUrl + archId + '/boms')
            .send(service_details)
            .set('accept', 'application/json')
            .then(res => {
                console.log(res.status);
                return res.body;
            });
    }

    doDeleteBOM(archiId: string): Promise<BillofMaterialsDataModel[]> {
        return superagent
            .delete(this.baseUrl + archiId + '/boms')
            .set('accept', 'application/json')
            .then(res => {
                return res.body;
            });
    }

}
