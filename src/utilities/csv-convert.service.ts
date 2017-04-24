import { Injectable } from '@angular/core';
import * as _ from 'underscore';

declare var $: any;


@Injectable()
export class CsvConvertService {
  public static readonly SEPARATOR = ";";

  constructor() { }

  toCSV(objArray : any) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = "";

    for (let index in objArray[0]) {
      //Now convert each value to string and comma-separated
      row += index + CsvConvertService.SEPARATOR;
    }
    row = row.slice(0, -1);
    //append Label row with line break
    str += row + '\r\n';

    for (var i = 0; i < array.length; i++) {
      var line = '';
      for (var index in array[i]) {
        if (line != '') line += CsvConvertService.SEPARATOR

        line += array[i][index];
      }
      str += line + '\r\n';
    }
    return str;
  }

  dataTableToJson(): any[] {
    let result : any[] = [];
    let headers : any[] = [];
    $('table.table th.column-header:visible').each(function (index:number, item:any) {
      let text = $(item).text().trim();
      headers[index] = _.isEmpty(text)?' ':text;
    });
    $('table.table tr.data-table-row').has('td.data-column').each(function () {
      let arrayItem : any [] = [];
      $('td.data-column:visible', $(this)).each(function (index:number, item:any) {
        let text = $(item).text().trim();
        arrayItem[headers[index]] = _.isEmpty(text)?' ':text;
      });
      result.push(arrayItem);
    });
    return result;
  }

  save(csvData: any, filename: string) {
    var atag: any = document.createElement("a");
    atag.setAttribute('style', 'display:none;');
    document.body.appendChild(atag);
    var blob = new Blob([
                    new Uint8Array([0xEF, 0xBB, 0xBF]), // UTF-8 BOM
                    csvData],
                    { type: "text/csv;charset=utf-8" });

    var url = window.URL.createObjectURL(blob);
    atag.href = url;

    var isIE = /*@cc_on!@*/false || !!(<any>document).documentMode;

    if (isIE) {
      var retVal = navigator.msSaveBlob(blob, filename + '.csv');
    }
    else {
      atag.download = filename + '.csv';
    }
    // If you will any error in a.download then dont worry about this. 
    atag.click();
  }
}
