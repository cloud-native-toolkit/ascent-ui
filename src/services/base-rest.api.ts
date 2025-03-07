import {QueryParameters} from "../models";

export abstract class BaseRestApi<T, N = T> {
    abstract list(parameters?: QueryParameters): Promise<T[]>;
    abstract add(newValue: N): Promise<T>;
    abstract get(id: string, parameters?: QueryParameters): Promise<T>;
    abstract update(id: string, updatedValue: T): Promise<T>;
}
