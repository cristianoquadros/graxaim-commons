import { Component, Inject, forwardRef } from '@angular/core';
import { DataTableComponent } from '../table/table.component';

import { CsvConvertService } from './../../utilities/csv-convert.service';
import { ToastyService } from './../../toasty/toasty.service';

declare var jsPDF: any;

@Component({
  selector: 'gx-datatable-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  host: {
    '(document:click)': '_closeSelector()'
  }
})
export class DataTableHeaderComponent {
    columnSelectorOpen = false;
    dataTable : DataTableComponent;

    _closeSelector() {
        this.columnSelectorOpen = false;
    }

    constructor( @Inject(forwardRef(() => DataTableComponent)) dataTable: DataTableComponent,
      private toasty: ToastyService,
      private csvService: CsvConvertService) {
      this.dataTable = dataTable;
    }

    onClickExportToPDF(){
      let doc = new jsPDF();
      var options = {};
      let tableElem = this.dataTable.htmlTableRef._results[0].nativeElement;
      let table = doc.autoTableHtmlToJson(tableElem);
      if (table.columns.length > 3){
          doc = new jsPDF('l');
          options = {
            startY: 20,
            margin: {horizontal: 7},
            columnStyles: {text: {columnWidth: 'auto'}} ,
            styles: {cellPadding: 0.5, fontSize: 8}
          }
      }else{
        options = {
          startY: 20,
          styles: {cellPadding: 0.5, fontSize: 8}
        };
      }
      let title = this.dataTable.headerTitle?this.dataTable.headerTitle:'TJ/RS-PPE - Consulta';
      doc.text(title, 14, 16);
      doc.autoTable(table.columns, table.data, options);         
      doc.save('tjrs-exporta-tabela.pdf');
      this.toasty.success({msg:'Arquivo exportado em PDF', timeout:5000})
    }

    onClickExportToCSV(){
      let table = this.csvService.dataTableToJson();
      let csvStr = this.csvService.toCSV(table);
      this.csvService.save(csvStr, 'tjrs-exporta-tabela');
      this.toasty.success({msg:'Arquivo exportado em CSV', timeout:5000})
    }     
}