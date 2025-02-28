import {ControlMapping, Profile, QueryParameters} from "../../models";
import {BaseRestApi} from "@/services/base-rest.api";

export abstract class ControlMappingApi extends BaseRestApi<ControlMapping> {
    abstract list(parameters?: QueryParameters): Promise<ControlMapping[]>;
    abstract add(mapping: ControlMapping): Promise<ControlMapping>;
    abstract update(id: string, updatedMapping: ControlMapping): Promise<ControlMapping>;
    abstract delete(mapping: ControlMapping): Promise<boolean>;

    abstract listServiceMappings(serviceId: string): Promise<object>;
    abstract listArchMappings(archId: string): Promise<object>;
    abstract listProfiles(parameters?: QueryParameters): Promise<Profile>;
    abstract importProfile(file: object): Promise<Profile>;
}
