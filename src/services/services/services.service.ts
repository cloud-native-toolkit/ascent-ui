
import { ServiceDataApi } from './service.api';
import { ServiceDataModel } from "../../models/services/serviceDataModel";
import * as superagent from "superagent";

export class ServiceData implements ServiceDataApi {

    baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl || '/services/';
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
}


