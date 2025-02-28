import {SolutionsApi} from "@/services/solutions/solutions.api";
import {SolutionsRest} from "@/services/solutions/solutions.rest";

export * from './solutions.api';

let _instance: SolutionsApi;
export const solutionsApi = (): SolutionsApi => {
    if (_instance) {
        return _instance;
    }

    return _instance = new SolutionsRest();
}
