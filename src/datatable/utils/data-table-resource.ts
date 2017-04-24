import { PageRequest, DataTableParams } from './../shared/datatable-params.interface';

export class DataTableResource<T> {

    constructor(private items: T[]) {}

    query(remoteParams: PageRequest, filter?: (item: T, index: number, items: T[]) => boolean): Promise<T[]> {

        let params = this.convertDataTableParam(remoteParams);
        let result: T[] = [];
        if (filter) {
            result = this.items.filter(filter);
        } else {
            result = this.items.slice(); // shallow copy to use for sorting instead of changing the original
        }

        if (params.sortBy) {
            result.sort((a, b) => {
                if (typeof a[params.sortBy] === 'string') {
                    return a[params.sortBy].localeCompare(b[params.sortBy]);
                } else {
                    return a[params.sortBy] - b[params.sortBy];
                }
            });
            if (params.sortAsc === false) {
                result.reverse();
            }
        }
        if (params.offset !== undefined) {
            if (params.limit === undefined) {
                result = result.slice(params.offset, result.length);
            } else {
                result = result.slice(params.offset, params.offset + params.limit);
            }
        }

        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(result));
        });
    }

    count(): Promise<number> {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(this.items.length));
        });

    }

    convertDataTableParam(remote: PageRequest): DataTableParams {
        let p = <DataTableParams>{};
        p.limit = remote.pageSize;
        p.offset = remote.offset;

        if (remote.sort) {
            p.sortBy = remote.sort.orders[0].property;
            p.sortAsc = remote.sort.orders[0].direction=='ASC';
        }    
        return p;
    }
}
