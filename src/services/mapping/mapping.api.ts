import { ControlMappingModel } from "../../models/control-mapping/controlMappingModel";
import { ProfileModel } from "../../models/control-mapping/profileModel";

export abstract class MappingDataApi {
    abstract async getMappings(filter: any): Promise<ControlMappingModel[]>;
    abstract async getServiceMappings(serviceId: string): Promise<ControlMappingModel>;
    abstract async getArchMappings(archId: string): Promise<ControlMappingModel>;
    abstract async addMapping(mappingDetails: any): Promise<ControlMappingModel>;
    abstract async updateMapping(mappingId: string, mappingDetails: any): Promise<any>;
    abstract async deleteMapping(mapping: any): Promise<any>;
    abstract async getProfiles(filter: any): Promise<ProfileModel[]>;
    abstract async addProfile(file: FormData): Promise<ProfileModel>;
}
