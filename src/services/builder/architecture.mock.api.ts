import { ArchiectureDataModel } from "../../models/builder/ArchitectureDataModel";
export abstract class ArchitectureDataApi {
    abstract async getArchitectureDetails(): Promise<ArchiectureDataModel[]>;
}