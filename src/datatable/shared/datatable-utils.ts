import { PageRequest, PageSortRequest, PageOrderRequest, DataTableParams } from './datatable-params.interface';

export function defaultRemoteParams() : PageRequest {
    let params = <PageRequest>{};
    let order = <PageOrderRequest>{};
    let sort = <PageSortRequest>{};

    order.property = ''; 
    order.direction = 'ASC';
    sort.orders = [order];
    
    params.sort = sort;
    params.offset = 0;
    params.pageSize = 10;
    params.pageNumber = 1;
    
    return params;
}

export function defaultParams() : DataTableParams {
    let params : DataTableParams  = {
        sortBy: '',
        sortAsc: true,
        offset: 0,
        limit: 10
    };
    return params;
}