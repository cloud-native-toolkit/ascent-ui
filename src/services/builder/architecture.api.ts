import { ArchitectureDataModel } from "../../models/builder/ArchitectureDataModel";

export abstract class ArchitectureDataApi {
    abstract async getArchitectures(): Promise<ArchitectureDataModel[]>;
    abstract async getArchitectureById(archid : string): Promise<ArchitectureDataModel>;
    abstract async addArchitecture(arch_details: Partial<ArchitectureDataModel>): Promise<ArchitectureDataModel>;
    abstract async deleteArchitecture(arch_id: string): Promise<void>;
    abstract async duplicateArchitecture(arch_id: string, data: object): Promise<ArchitectureDataModel>;
    abstract async importBomYaml(data: FormData, overwrite: boolean, publicArch: boolean): Promise<object>;
    abstract async uploadDiagrams(arch_id: string, data: FormData): Promise<any>;
    abstract async updateArchitecture(archiId: string, arch_details: any): Promise<ArchitectureDataModel>;
}
