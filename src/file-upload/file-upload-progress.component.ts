import { Component, OnInit, Input, Output } from '@angular/core';

import { FileUploader, FileItem } from 'ng2-file-upload';
import { FileUploadService } from './file-upload.service';

@Component({
    selector: 'gx-file-upload-progress',
    template: `
    <div class="progress" style="margin-bottom: 0;">   
        <div [ngClass]="{'progress-bar':true, 'progress-success':item.isSuccess, 'progress-danger':item.isError}" 
            role="progressbar" 
            [ngStyle]="{ 'width': item.progress + '%' }">
            <a href="javascript:" (click)="item.cancel()" *ngIf="item.isUploading">
                <i class="fa fa-window-close text-muted" aria-hidden="true" title="Cancela"></i>               
            </a>                                 
        </div>
    </div>  
  `,
    styles: [`
    .progress {
        font-size: 12px;
    }`,
        `.progress-bar {
        height: 16px;
        color: #fff;
        background-color: #0275d8;
    }
  `]
})
export class FileUploadProgressComponent {

    @Input('fileItem') item: FileItem;

    constructor() { }

}
