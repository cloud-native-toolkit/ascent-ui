
export interface QueryFilter<T = any> {
    include?: string[];
    offset?: number;
    limit?: number;
    skip?: number;
    order?: string;
    fields?: {[key in keyof T]: boolean};
}

export interface QueryParameters {
    filter?: QueryFilter;
}

export const parametersToQueryString = (parameters?: QueryParameters): string => {
    if (!parameters || !parameters.filter || !parameters.filter.include) {
        return ''
    }

    return `?filter=${encodeURIComponent(JSON.stringify(parameters.filter))}`
}
