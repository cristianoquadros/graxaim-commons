import { FileUploader } from 'ng2-file-upload';
import { FileUploadService } from './file-upload.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'gx-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {

  @Input() acceptFile: string;
  @Input() tip: string;
  hasBaseDropZoneOver: boolean = false;

  constructor(private fileUploader: FileUploadService) { }

  ngOnInit() {
  }

  get uploader(): FileUploader {
    return this.fileUploader;
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }



}
