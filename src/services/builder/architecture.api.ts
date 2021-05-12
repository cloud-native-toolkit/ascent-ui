import { ArchiectureDataModel } from "../../models/builder/ArchitectureDataModel";

export abstract class ArchitectureDataApi {
    abstract async getArchitectures(): Promise<ArchiectureDataModel[]>;
    abstract async getArchitectureById(archid : string): Promise<ArchiectureDataModel>;
    abstract async addArchitecture(arch_details: Partial<ArchiectureDataModel>): Promise<ArchiectureDataModel>;
    abstract async uploadDiagrams(arch_id: string, data: FormData): Promise<any>;
    abstract async updateArchitecture(archiId: string, arch_details: any): Promise<ArchiectureDataModel>;
}
