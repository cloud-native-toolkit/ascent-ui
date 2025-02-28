import {Architectures, BaseSolution, Solution} from "@/models";
import {BaseRestApi} from "@/services/base-rest.api";

export interface CompositeSolution {
    solution: BaseSolution,
    architectures: Array<Partial<Omit<Architectures, "arch_id">> & {arch_id: string}>,
    solutions: string[],
    platform: string
}

export abstract class SolutionsApi extends BaseRestApi<Solution> {
    abstract list(): Promise<Solution[]>;
    abstract get(id: string): Promise<Solution>;
    abstract add(solution: Solution): Promise<Solution>;
    abstract update(id: string, solution: Solution): Promise<Solution>;
    abstract delete(id: string): Promise<boolean>;

    abstract addComposite(value: CompositeSolution): Promise<Solution>;
    abstract updateComposite(id: string, value: CompositeSolution): Promise<Solution>;

    abstract listUserSolutions(email: string): Promise<Solution[]>;
    // TODO determine return type
    abstract getSolutionAutomation(id: string): Promise<Blob>;
    abstract getSolutionFileContent(id: string, fileName: string): Promise<string>;
    abstract deploySolutionToTechzone(id: string): Promise<string>;
    abstract uploadDiagrams(id: string, files: Array<{name: string, file: File}>): Promise<boolean>;
}
