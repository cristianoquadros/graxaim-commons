import { ToastyConfig } from './../../toasty/toast-config.service';
import { Component, Inject, forwardRef } from '@angular/core';
import { DataTableComponent } from '../table/table.component';

import { ToastyService } from '../../toasty/toasty.service';

@Component({
  selector: 'gx-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],  
})
export class DataTablePaginationComponent {
    
    private MAX_LIMIT : number  = 100;

    constructor(
        @Inject(forwardRef(() => DataTableComponent)) public dataTable: DataTableComponent,
       private toastyService: ToastyService) {
    }

    pageBack() {
        this.dataTable.offset -= Math.min(this.dataTable.limit, this.dataTable.offset);
    }

    pageForward() {
        this.dataTable.offset += this.dataTable.limit;
    }

    pageFirst() {
        this.dataTable.offset = 0;
    }

    pageLast() {
        this.dataTable.offset = (this.maxPage - 1) * this.dataTable.limit;
    }

    get maxPage() {
        return Math.ceil(this.dataTable.itemCount / this.dataTable.limit);
    }

    get limit() {
        return this.dataTable.limit;
    }

    set limit(value) {
        if (value <= this.MAX_LIMIT){
            this.dataTable.limit = Number(<any>value); // TODO better way to handle that value of number <input> is string?
        }else{
            this.toastyService.warning({msg: "Valor inválido", timeout: 2000});
        }    
    }

    get page() {
        return this.dataTable.page;
    }

    set page(page) {
        this.dataTable.page=page;
    }    

    onPageChange(event:Event){
        let value = Number((<HTMLInputElement>event.target).value);
        if (value > 0 && value <= this.maxPage){
            this.dataTable.page = value;
        }else{            
            (<HTMLInputElement>event.target).value=''+this.dataTable.page;
            this.toastyService.warning({msg: "Valor inválido", timeout: 2000});            
        }          
    }
}