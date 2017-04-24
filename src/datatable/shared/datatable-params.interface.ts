export interface DataTableParams {
    offset?: number;
    limit?: number;
    sortBy?: string;
    sortAsc?: boolean;
}

export interface PageRequest {
    pageNumber: number;
    pageSize: number;
    offset: number;
    sort?: PageSortRequest;
}

export interface PageSortRequest {
    orders: [PageOrderRequest];
}

export interface PageOrderRequest {
    property?: string;
    direction?: String;
    nullsFirst?: boolean;
}

export interface PageResponse {
    content?: [Object];
    totalResults?: number;
    request?:PageRequest
}