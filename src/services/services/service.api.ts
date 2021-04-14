import { ServiceDataModel } from "../../models/services/serviceDataModel";

export abstract class ServiceDataApi {
    abstract async getServices(): Promise<ServiceDataModel[]>;
    abstract async getServicesComposite(): Promise<ServiceDataModel[]>;
    abstract async getServiceDetails(serviceId: string): Promise<ServiceDataModel>;
    abstract async getServiceCatalog(serviceId: string): Promise<any>;
    abstract async doDeleteService(serviceId: string): Promise<any>;
    abstract async doAddService(serviceDetails: any): Promise<ServiceDataModel>;
    abstract async doUpdateService(serviceDetails: any, serviceId: string): Promise<ServiceDataModel>;
}


