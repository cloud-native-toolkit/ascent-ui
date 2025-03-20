
export interface QueryFilter<T = unknown> {
    include?: string[];
    offset?: number;
    limit?: number;
    skip?: number;
    order?: string;
    fields?: {[key in keyof T]: boolean};
}

export interface QueryParameters<T = unknown> {
    filter?: QueryFilter<T>;
}

export const parametersToQueryString = (parameters?: QueryParameters): string => {
    if (!parameters || !parameters.filter || !parameters.filter.include) {
        return ''
    }

    return `?filter=${encodeURIComponent(JSON.stringify(parameters.filter))}`
}
