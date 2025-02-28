import {parametersToQueryString, QueryParameters} from "../models";

export class RestCrudClient<T, N = T> {
    readonly baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async list(parameters?: QueryParameters): Promise<T[]> {
        return fetch(`${this.baseUrl}${parametersToQueryString(parameters)}`)
            .then(res => res.json())
    }

    async add(newValue: N): Promise<T> {
        return fetch(
            this.baseUrl,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newValue)
            })
            .then(res => res.json())
    }

    async get(id: string, parameters?: QueryParameters): Promise<T> {
        return fetch(`${this.baseUrl}/${id}${parametersToQueryString(parameters)}`)
            .then(res => res.json())
    }

    async update(id: string, updatedValue: T): Promise<T> {
        return fetch(
            `${this.baseUrl}/${id}`,
            {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedValue)
            })
            .then(res => res.json())
    }

    async deleteById(id: string): Promise<boolean> {
        return fetch(`${this.baseUrl}/${id}`, { method: 'DELETE' })
            .then(res => {
                if (res.status !== 204) {
                    throw new Error(`${res.status} ${res.statusText}`);
                }

                return true
            })
    }

    async deleteByObject(value: T): Promise<boolean> {
        return fetch(
            this.baseUrl,
            {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(value)
            })
            .then(res => res.json())
    }

}