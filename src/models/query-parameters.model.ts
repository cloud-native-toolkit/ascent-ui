
export interface QueryFilter {
    include?: string[]
}

export interface QueryPagination {
    page?: number;
    pageSize?: number;
}

export interface QueryParameters {
    filter?: QueryFilter;
    pagination?: QueryPagination;
}

export const parametersToQueryString = (parameters?: QueryParameters): string => {
    if (!parameters || !parameters.filter || !parameters.filter.include) {
        return ''
    }

    return `?filter=${encodeURIComponent(JSON.stringify(parameters.filter))}`
}
