import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ToastData } from './toast-data.interface';

/**
 * A Toast component shows message with title and close button.
 */
@Component({
  selector: 'gx-toast',
  template: `
        <div class="toast alert" [ngClass]="[toast.type]" role="alert" *ngIf="toast.msg">
            <span class="toast-text"><strong>{{toast.alert}}</strong> {{toast.msg}}</span>
            <div *ngIf="toast.showClose" class="close-button" (click)="close($event)"></div>            
        </div>`
})
export class ToastComponent {

  @Input() toast: ToastData;
  @Output('closeToast') closeToastEvent = new EventEmitter();

  /**
   * Event handler invokes when user clicks on close button.
   * This method emit new event into ToastyContainer to close it.
   */
  close($event: any) {
    $event.preventDefault();
    this.closeToastEvent.next(this.toast);
  }
}
