import { SolutionDataModel } from "../../models/builder/SolutionDataModel";

export abstract class SolutionsDataApi {
    abstract async getSolutions(): Promise<SolutionDataModel[]>;
    abstract async getSolutionById(archid : string): Promise<SolutionDataModel>;
    abstract async addSolution(arch_details: Partial<SolutionDataModel>): Promise<SolutionDataModel>;
    abstract async deleteSolution(arch_id: string): Promise<void>;
    abstract async updateSolution(archiId: string, arch_details: any): Promise<SolutionDataModel>;
}