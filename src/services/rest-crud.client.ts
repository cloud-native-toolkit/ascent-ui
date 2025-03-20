import {parametersToQueryString, QueryParameters} from "@/models";

export class RestError extends Error {
    constructor(public status: number, name: string, message: string) {
        super(message);
    }
}

export const isRestError = (error: unknown): error is RestError => {
    return !!error && !!(error as {status: string}).status;
};

export const handleJsonResponse = (response: Response) => {
    return handleResponse(response, (r: Response) => r.json())
};

export const handleTextResponse = (response: Response) => {
    return handleResponse(response, (r: Response) => r.text())
};

export const handleBlobResponse = (response: Response) => {
    return handleResponse(response, (r: Response) => r.blob())
};

export const handleBooleanResponse = (response: Response) => {
    return handleResponse(response, () => true);
};

const handleResponse = <T>(response: Response, getData: (r: Response) => T): T => {
    if (response.status >= 200 && response.status < 300) {
        return getData(response);
    } else {
        throw new RestError(response.status, response.statusText, response.statusText);
    }
}

export class RestCrudClient<T, N = T> {
    readonly baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async list(parameters?: QueryParameters): Promise<T[]> {
        return fetch(`${this.baseUrl}${parametersToQueryString(parameters)}`)
            .then(handleJsonResponse)
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
            .then(handleJsonResponse)
    }

    async get(id: string, parameters?: QueryParameters): Promise<T> {
        return fetch(`${this.baseUrl}/${id}${parametersToQueryString(parameters)}`)
            .then(handleJsonResponse)
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
            .then(handleJsonResponse)
    }

    async deleteById(id: string): Promise<boolean> {
        return fetch(`${this.baseUrl}/${id}`, { method: 'DELETE' })
            .then(handleBooleanResponse)
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
            .then(handleJsonResponse)
    }

}