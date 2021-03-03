
import { ServiceDataApi } from './service.api';
import { ServiceDataModel } from "../../models/services/serviceDataModel";
import * as superagent from "superagent";

export class ServiceData implements ServiceDataApi {

    baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl || '/services';
    }

    async getServices(): Promise<ServiceDataModel[]> {
        return superagent
            .get(this.baseUrl)
            .set('accept', 'application/json')
            .then(res => {
                return res.body || [];
            });

    }

    async getServiceDetails(serviceId: string): Promise<ServiceDataModel> {
        return superagent
            .get(this.baseUrl + serviceId)
            .set('accept', 'application/json')
            .then(res => {

                return res.body;
            });
    }
    async doDeleteService(serviceId: string): Promise<ServiceDataModel> {
        return superagent
            .delete(this.baseUrl + serviceId)
            .set('accept', 'application/json')
            .then(res => {
                console.log(res.status);
                return res.body;
            });
    }
    async doAddService(service_details: any): Promise<ServiceDataModel> {
        console.log(service_details);
        return superagent
            .post(this.baseUrl)
            .send(service_details)
            .set('accept', 'application/json')
            .then(res => {
                console.log(res.status);
                return res.body;
            });
    }
}


