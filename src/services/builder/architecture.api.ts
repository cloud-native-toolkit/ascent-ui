import { ArchiectureDataModel } from "../../models/builder/ArchitectureDataModel";

export abstract class ArchitectureDataApi {
    abstract async getArchitectures(): Promise<ArchiectureDataModel[]>;
    abstract async getArchitectureById(archid : string): Promise<ArchiectureDataModel>;
}


