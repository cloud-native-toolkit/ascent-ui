import { ServiceDataModel } from "../../models/services/serviceDataModel";

export abstract class ServiceDataApi {
    abstract async getServices(): Promise<ServiceDataModel[]>;
    abstract async getServiceDetails(serviceId: string): Promise<ServiceDataModel>;
    abstract async doDeleteService(serviceId: string): Promise<ServiceDataModel>;
    abstract async doAddService(serviceDetails: any): Promise<ServiceDataModel>;
    abstract async doUpdateService(serviceDetails: any, serviceId: string): Promise<ServiceDataModel>;
}


