
import { ServiceDataApi } from './service.api';
import { ServiceDataModel } from "../../models/services/serviceDataModel";
import { ControlMappingModel } from "../../models/control-mapping/controlMappingModel";
import * as superagent from "superagent";

export class ServiceData implements ServiceDataApi {

    baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl || '/api/services';
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
            .get(this.baseUrl + "/" + serviceId + "?filter=%7B%22include%22%3A%20%5B%22controls%22%5D%7D")
            .set('accept', 'application/json')
            .then(res => {
                return res.body;
            });
    }

    async getServiceCatalog(serviceId: string): Promise<any> {
        return superagent
            .get(this.baseUrl + "/catalog/" + serviceId)
            .set('accept', 'application/json')
            .then(res => {
                return res.body;
            });
    }
    async doDeleteService(serviceId: string): Promise<any> {
        return superagent
            .delete(this.baseUrl + "/" + serviceId)
            .set('accept', 'application/json')
            .then(res => {
                return res;
            });
    }
    async doAddService(service_details: any): Promise<ServiceDataModel> {
        return superagent
            .post(this.baseUrl)
            .send(service_details)
            .set('accept', 'application/json')
            .then(res => {
                console.log(res.status);
                return res.body;
            })
            .catch(err => {
                return err.response;
            });
    }
    async doUpdateService(service_details: any, serviceId: string): Promise<ServiceDataModel> {
        return superagent
            .patch(this.baseUrl + "/" + serviceId)
            .send(service_details)
            .set('accept', 'application/json')
            .then(res => {
                console.log(res.status);
                return res.body;
            })
            .catch(err => {
                return err.response;
            });
    }

    async doMapControl(mapping_details: any, serviceId: string): Promise<ControlMappingModel> {
        mapping_details.service_id = serviceId;
        return superagent
            .post("/api/control-mapping")
            .send(mapping_details)
            .set('accept', 'application/json')
            .then(res => {
                return res.body;
            })
            .catch(err => {
                return err.response;
            });
    }
}
