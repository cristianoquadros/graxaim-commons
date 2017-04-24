import { ToastyService } from './../toasty/toasty.service';
import { Subject } from 'rxjs';
import { Injectable, EventEmitter } from '@angular/core';
import { FileUploader, FileItem } from 'ng2-file-upload';


@Injectable()
export class FileUploadService extends FileUploader {

  afterAddedFile = new EventEmitter<any>();
  afterSuccessedFile = new EventEmitter<any>();
  queue: Array<any>;
  private documentosPorPeticao: Map<number, any[]>;

  constructor(private toastMsg: ToastyService) {
    super({
      url: '/ppe/ppe-web/rest/documentos/upload',
      autoUpload: true,
      removeAfterUpload: true
    });
    this._nextIndex = 0;
  }

  addAll(documentos: Array<any>) {
    let files: File[] = [];
    documentos.forEach(doc => {
      files.push(doc._file);
    });
    this.addToQueue(files);
  }

  get uploadItems(): Array<any> {
    return this.queue;
  }

  getUploader(): FileUploader {
    return this;
  }

  onAfterAddingFile(file: any) {
    this.afterAddedFile.next(file);
    //file.upload();
  }

  deleteItem(item: any) {
    item.remove();
  }

  onSuccessItem(item: any, response: string, status: number, headers: any): any {
    this.afterSuccessedFile.emit(item);
    return { item: item, response: response, status: status, headers: headers };
  }


  onCompleteItem(item: any, response: string, status: number, headers: any): any {
    try {
      if (item.isSuccess) {
        var reponseJson = JSON.parse(response).data;
        if (reponseJson) {
          item.hash = reponseJson.hashDocumento;
          item.token = reponseJson.pathTemporario;
        }
      }
    } catch (error) {
      console.log(error);
    }
    return { item: item, response: response, status: status, headers: headers };
  }

  moveItemUp(old_index: number) {
    let new_index = old_index - 1;
    if (new_index >= 0) {
      let fileItemTmp = this.queue[new_index];
      this.queue[new_index] = this.queue[old_index];
      this.queue[old_index] = fileItemTmp;
    }

  }
  moveItemDown(old_index: number) {
    let new_index = old_index + 1;
    let size = this.queue.length;
    if (new_index < size) {
      let fileItemTmp = this.queue[new_index];
      this.queue[new_index] = this.queue[old_index];
      this.queue[old_index] = fileItemTmp;
    }
  }

}