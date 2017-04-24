import {
    Component, Input, Output, EventEmitter, ContentChildren, QueryList,
    TemplateRef, ContentChild, ViewChildren, OnInit
    } from '@angular/core';

import { DataTableColumnComponent } from '../column/column.component';
import { DataTableParams } from '../shared/datatable-params.interface';
import { defaultTranslations } from '../shared/datatable-defaults.data';
import { DataTableTranslations } from '../shared/datatable-translations.interface';
import { drag } from '../utils/drag';
import { defaultParams } from '../shared/datatable-utils';
import { PageRequest, PageOrderRequest, PageSortRequest } from './../shared/datatable-params.interface';

export type RowCallback = (item: any, index: number) => string;

@Component({
  selector: 'gx-datatable',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],  
})
export class DataTableComponent implements DataTableParams, OnInit {

    private _items: any[] = [];    

    get items() {
        return this._items;
    }

    @Input()
    set items(items: any[]) {
        this._items = items;
        this._onReloadFinished();
    }

    @Input() itemCount: number;

    // UI components:
    @ViewChildren('htmlTableRef') htmlTableRef;
    @ContentChildren(DataTableColumnComponent) columns: QueryList<DataTableColumnComponent>;
    @ContentChild('dataTableExpand') expandTemplate: TemplateRef<any>;

    // One-time optional bindings with default values:

    @Input() headerTitle: string = '';
    @Input() header = true;
    @Input() pagination = true;
    @Input() indexColumn = true;
    @Input() indexColumnHeader = '';
    @Input() rowColors: RowCallback;
    @Input() rowTooltip: RowCallback;
    @Input() selectColumn = false;
    @Input() substituteRows = false;
    @Input() expandableRows = false;
    @Input() translations: DataTableTranslations = defaultTranslations;
    @Input() selectOnRowClick = false;
    @Input() autoReload = false;
    @Input() showReloading = true;

    // UI state without input:

    indexColumnVisible: boolean;
    selectColumnVisible: boolean;
    expandColumnVisible: boolean;

    // UI state: visible ge/set for the outside with @Input for one-time initial values

    private _sortBy: string;
    private _sortAsc = true;

    private _offset = 0;
    private _limit = 10;

    // Row Controller

    private _selected: boolean;
    @Output() selectedChange = new EventEmitter();    

    @Input()
    get sortBy() {
        return this._sortBy;
    }

    set sortBy(value) {
        this._sortBy = value;
        this._triggerReload();
    }

    @Input()
    get sortAsc() {
        return this._sortAsc;
    }

    set sortAsc(value) {
        this._sortAsc = value;
        this._triggerReload();
    }

    @Input()
    get offset() {
        return this._offset;
    }

    set offset(value) {
        this._offset = value;
        this._triggerReload();
    }

    @Input()
    get limit() {
        return this._limit;
    }

    set limit(value) {
        this._limit = value;
        this._triggerReload();
    }

    // calculated property:

    @Input()
    get page() {
        return Math.round(this.offset / this.limit) + 1;
    }

    set page(value) {
        this.offset = (value - 1) * this.limit;
    }

    get lastPage() {
        return Math.ceil(this.itemCount / this.limit);
    }

    // setting multiple observable properties simultaneously

    sort(sortBy: string, asc: boolean) {
        this.sortBy = sortBy;
        this.sortAsc = asc;
    }

    // init

    ngOnInit() {
        this._initDefaultValues();
        this._initDefaultClickEvents();
        this._updateDisplayParams();

        if (this.autoReload && this._scheduledReload == null) {
            this.reloadItems();
        }
    }

    private _initDefaultValues() {
        this.indexColumnVisible = this.indexColumn;
        this.selectColumnVisible = this.selectColumn;
        this.expandColumnVisible = this.expandableRows;
    }

    private _initDefaultClickEvents() {
        this.headerClick.subscribe(tableEvent => this.sortColumn(tableEvent.column));
        if (this.selectOnRowClick) {
            this.rowClick.subscribe(tableEvent => tableEvent.row.selected = !tableEvent.row.selected);
        }
    }

    // Reloading:

    _reloading = false;

    get reloading() {
        return this._reloading;
    }

    @Output() reload = new EventEmitter();

    reloadItems() {
        this._reloading = true;
        this.reload.emit(this._getRemoteParameters());
    }

    private _onReloadFinished() {
        this._updateDisplayParams();

        this._selectAllCheckbox = false;
        this._reloading = false;
    }

    _displayParams = <DataTableParams>{}; // params of the last finished reload

    get displayParams() {
        return this._displayParams;
    }

    _updateDisplayParams() {
        if (this._reloading){
            this._displayParams = {
                sortBy: this.sortBy,
                sortAsc: this.sortAsc,
                offset: this.offset,
                limit: this.limit
            };
        }else{
            this._displayParams = defaultParams();
            this._sortBy=this._displayParams.sortBy;
            this._sortAsc=this._displayParams.sortAsc;
            this._offset=this._displayParams.offset;
            this._limit=this._displayParams.limit;            
        }    
    }

    _scheduledReload = null;

    // for avoiding cascading reloads if multiple params are set at once:
    _triggerReload() {
        if (this._scheduledReload) {
            clearTimeout(this._scheduledReload);
        }
        this._scheduledReload = setTimeout(() => {
            this.reloadItems();
        });
    }

    // event handlers:

    @Output() rowClick = new EventEmitter();
    @Output() rowDoubleClick = new EventEmitter();
    @Output() headerClick = new EventEmitter();
    @Output() cellClick = new EventEmitter();

    rowClicked(item: any, event) {
        this.rowClick.emit({ item, event });
    }

    rowDoubleClicked(item: any, event) {
        this.rowDoubleClick.emit({ item, event });
    }

    headerClicked(column: DataTableColumnComponent, event: MouseEvent) {
        if (!this._resizeInProgress) {
            this.headerClick.emit({ column, event });
        } else {
            this._resizeInProgress = false; // this is because I can't prevent click from mousup of the drag end
        }
    }

    private cellClicked(column: DataTableColumnComponent, item: any, event: MouseEvent) {
        this.cellClick.emit({ item, column, event });
    }

    // functions:

    private _getRemoteParameters(): PageRequest {
        let params = <PageRequest>{};
        let order = <PageOrderRequest>{};
        let sort = <PageSortRequest>{};

        if (this.sortBy) {
            order.property = this.sortBy; 
            order.direction = this.sortAsc?'ASC':'DESC';
            sort.orders = [order];
            params.sort = sort;
        }
        if (this.pagination) {
            params.offset = this.offset;
            params.pageSize = this.limit;
            params.pageNumber = this.page;
        }
        return params;
    }

    private sortColumn(column: DataTableColumnComponent) {
        if (column.sortable) {
            let ascending = this.sortBy === column.property ? !this.sortAsc : true;
            this.sort(column.property, ascending);
        }
    }

    get columnCount() {
        let count = 0;
        count += this.indexColumnVisible ? 1 : 0;
        count += this.selectColumnVisible ? 1 : 0;
        count += this.expandColumnVisible ? 1 : 0;
        this.columns.toArray().forEach(column => {
            count += column.visible ? 1 : 0;
        });
        return count;
    }

    getRowColor(item: any, index: number) {
        if (this.rowColors !== undefined) {
            return (<RowCallback>this.rowColors)(item, index);
        }
    }

    // selection:

    selectedRow: any;

    private _selectAllCheckbox = false;

    get selectAllCheckbox() {
        return this._selectAllCheckbox;
    }

    onRowSelectChanged(item: any) {
        this.selectedRow = item;
    }

    // other:

    get substituteItems() {
        return Array.from({ length: this.displayParams.limit - this.items.length });
    }

    // column resizing:

    private _resizeInProgress = false;

    private resizeColumnStart(event: MouseEvent, column: DataTableColumnComponent, columnElement: HTMLElement) {
        this._resizeInProgress = true;

        drag(event, {
            move: (moveEvent: MouseEvent, dx: number) => {
                if (this._isResizeInLimit(columnElement, dx)) {
                    column.width = columnElement.offsetWidth + dx;
                }
            },
        });
    }

    resizeLimit = 30;

    private _isResizeInLimit(columnElement: HTMLElement, dx: number) {
        /* This is needed because CSS min-width didn't work on table-layout: fixed.
         Without the limits, resizing can make the next column disappear completely,
         and even increase the table width. The current implementation suffers from the fact,
         that offsetWidth sometimes contains out-of-date values. */
        if ((dx < 0 && (columnElement.offsetWidth + dx) <= this.resizeLimit) ||
            !columnElement.nextElementSibling || // resizing doesn't make sense for the last visible column
            (dx >= 0 && ((<HTMLElement> columnElement.nextElementSibling).offsetWidth + dx) <= this.resizeLimit)) {
            return false;
        }
        return true;
    }

    // Row Controller


    get selected() {
        return this._selected;
    }

    set selected(selected) {
        this._selected = selected;
        this.selectedChange.emit(selected);
    }  

    displayIndex(index) {
        if (this.pagination) {
            return this.displayParams.offset + index + 1;
        } else {
            return index + 1;
        }
    }

    getTooltip(item:any, index:number) {
        if (this.rowTooltip) {
            return this.rowTooltip(item, index);
        }
        return '';
    }      
}
