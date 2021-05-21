import { ArchiectureDataModel } from "../../models/builder/ArchitectureDataModel";

export abstract class ArchitectureDataApi {
    abstract async getArchitectures(): Promise<ArchiectureDataModel[]>;
    abstract async getArchitectureById(archid : string): Promise<ArchiectureDataModel>;
    abstract async addArchitecture(arch_details: Partial<ArchiectureDataModel>): Promise<ArchiectureDataModel>;
    abstract async deleteArchitecture(arch_id: string): Promise<void>;
    abstract async importBomYaml(arch_id: string, data: FormData, overwrite: boolean): Promise<object>;
    abstract async uploadDiagrams(arch_id: string, data: FormData): Promise<any>;
    abstract async updateArchitecture(archiId: string, arch_details: any): Promise<ArchiectureDataModel>;
}
