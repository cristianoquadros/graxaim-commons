import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ToastOptions } from './toast-options.interface';
import { ToastyConfig } from './toast-config.service';
import { ToastData } from './toast-data.interface';
import { isString, isNumber, isFunction } from './toasty.utils';

@Injectable()
export class ToastyService {
  
  uniqueCounter: number = 0;

  // ToastData event emitter
  private toastsEmitter: EventEmitter<ToastData> = new EventEmitter<ToastData>();
  // Clear event emitter
  private clearEmitter: EventEmitter<number> = new EventEmitter<number>();

  constructor(private config: ToastyConfig) {}

  /**
   * Get list of toats
   */
  getToasts(): Observable<ToastData> {
    return this.toastsEmitter.asObservable();
  }

  getClear(): Observable<number> {
    return this.clearEmitter.asObservable();
  }

  /**
   * Create Toast of info type
   * @param  {object} options Individual toasty config overrides
   */
  info(options: ToastOptions|string|number): void {
    this.add(options, 'info');
  }

  /**
   * Create Toast of success type
   * @param  {object} options Individual toasty config overrides
   */
  success(options: ToastOptions|string|number): void {
    this.add(options, 'success');
  }

  /**
   * Create Toast of wait type
   * @param  {object} options Individual toasty config overrides
   */
  wait(options: ToastOptions|string|number): void {
    this.add(options, 'wait');
  }

  /**
   * Create Toast of error type
   * @param  {object} options Individual toasty config overrides
   */
  error(options: ToastOptions|string|number): void {
    this.add(options, 'danger');
  }

  /**
   * Create Toast of warning type
   * @param  {object} options Individual toasty config overrides
   */
  warning(options: ToastOptions|string|number): void {
    this.add(options, 'warning');
  }


  // Add a new toast item
  private add(options: ToastOptions|string|number, type: string) {
    let toastyOptions: ToastOptions = <ToastOptions>options;

    if (!toastyOptions.msg) {
      throw new Error('Toasty: No toast message specified!');
    }

    type = type || 'warning';

    // Set a unique counter for an id
    this.uniqueCounter++;

    // Set the local vs global config items
    let showClose = this.checkConfigItem(this.config, toastyOptions, 'showClose');

    let toast: ToastData = <ToastData>{
      id       : this.uniqueCounter,
      msg      : toastyOptions.msg,
      alert    : toastyOptions.alert,
      showClose: showClose,
      type     : 'alert-' + type,
      onAdd    : toastyOptions.onAdd && isFunction(toastyOptions.onAdd) ? toastyOptions.onAdd : null,
      onRemove : toastyOptions.onRemove && isFunction(toastyOptions.onRemove) ? toastyOptions.onRemove : null
    };

    // If there's a timeout individually or globally, set the toast to timeout
    toast.timeout = toastyOptions.hasOwnProperty('timeout') ? toastyOptions.timeout : this.config.timeout;

    // Push up a new toast item
    // this.toastsSubscriber.next(toast);
    this.toastsEmitter.next(toast);

    // If we have a onAdd function, call it here
    if (toastyOptions.onAdd && isFunction(toastyOptions.onAdd)) {
      toastyOptions.onAdd.call(this, toast);
    }
  }

  // Clear all toasts
  clearAll() {
    this.clearEmitter.next(null);
  }

  // Clear the specific one
  clear(id: number) {
    this.clearEmitter.next(id);
  }

  // Checks whether the local option is set, if not,
  // checks the global config
  private checkConfigItem(config: any, options: any, property: string) {
    if (options[property] === false) {
      return false;
    } else if (!options[property]) {
      return config[property];
    } else {
      return true;
    }
  }
}
