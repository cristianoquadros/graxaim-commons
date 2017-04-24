import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextMaskModule } from 'angular2-text-mask';

import { PixelConverter } from './datatable/utils/px';
import { MinPipe } from './datatable/utils/min';
import { Hide } from './datatable/utils/hide';
import { DataTableComponent } from './datatable/table/table.component';
import { DataTableColumnComponent } from './datatable/column/column.component';
import { DataTablePaginationComponent } from './datatable/pagination/pagination.component';
import { DataTableHeaderComponent } from './datatable/header/header.component';

import { ToastyConfig } from './toasty/toast-config.service';
import { ToastComponent } from './toasty/toast.component';
import { ToastyService } from './toasty/toasty.service';
import { ToastyComponent } from './toasty/toasty.component';
import { DatePickerComponent } from './datepicker/datepicker.component';
import { AutofocusDirective } from './utilities/autofocus.directive';
import { PreventEnterDirective } from './utilities/prevent-enter.directive';
import { LoadingbarComponent } from './loadingbar/loadingbar.component';

import { TooltipComponent } from "./tooltip/tooltip.component";
import { HeaderComponent } from './header/header.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { FileUploadService } from './file-upload/file-upload.service';
import { FileUploadProgressComponent } from './file-upload/file-upload-progress.component';
import { FileUploadModule } from 'ng2-file-upload';
import { FileSizePipe } from './file-upload/file-size.pipe';

import { BundleDirective } from './bundle/bundle.directive';
import { CsvConvertService } from './utilities/csv-convert.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TextMaskModule,
    ReactiveFormsModule,
    FileUploadModule
  ],
  exports: [
    ToastyComponent, ToastComponent,
    DataTableComponent, DataTableColumnComponent, DatePickerComponent,
    AutofocusDirective, PreventEnterDirective, LoadingbarComponent,
    TooltipComponent,
    CommonModule, FormsModule, TextMaskModule, ReactiveFormsModule,
    BundleDirective, HeaderComponent,
    FileUploadComponent,FileUploadProgressComponent,
    FileSizePipe
  ],
  providers: [],
  declarations: [
    ToastyComponent, ToastComponent,
    DataTableHeaderComponent, DataTablePaginationComponent,
    DataTableColumnComponent, DataTableComponent, PixelConverter, Hide, MinPipe,
    DatePickerComponent, AutofocusDirective, PreventEnterDirective, LoadingbarComponent,
    TooltipComponent, BundleDirective,
    HeaderComponent,  FileSizePipe,
    FileUploadComponent, FileUploadProgressComponent
  ]
})

export class GraxaimCommonsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: GraxaimCommonsModule,
      providers: [
        ToastyService, ToastyConfig, FileUploadService, CsvConvertService
      ]
    };
  }
}