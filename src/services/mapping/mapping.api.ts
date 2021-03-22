import { ControlMappingModel } from "../../models/control-mapping/controlMappingModel";

export abstract class MappingDataApi {
    abstract async getMappings(): Promise<ControlMappingModel[]>;
    abstract async getServiceMappings(serviceId: string): Promise<ControlMappingModel>;
    abstract async getArchMappings(archId: string): Promise<ControlMappingModel>;
    abstract async addMapping(mappingDetails: any): Promise<ControlMappingModel>;
    abstract async deleteMapping(mapping: any): Promise<any>;
}
