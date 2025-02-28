import {QueryParameters} from "../models";
import {BaseRestApi} from "@/services/base-rest.api";
import {RestCrudClient} from "@/services/rest-crud.client";

export abstract class BaseRest<T, N = T> implements BaseRestApi<T, N> {
    readonly client: RestCrudClient<T, N>

    protected constructor(baseUrl: string) {
        this.client = new RestCrudClient(baseUrl);
    }

    async list(parameters?: QueryParameters): Promise<T[]> {
        return this.client.list(parameters);
    }

    async add(newValue: N): Promise<T> {
        return this.client.add(newValue);
    }

    async get(id: string, parameters?: QueryParameters): Promise<T> {
        return this.client.get(id, parameters);
    }

    async update(id: string, updatedValue: T): Promise<T> {
        return this.client.update(id, updatedValue);
    }
}
