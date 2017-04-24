import { Injectable } from '@angular/core';

@Injectable()
export class ToastyConfig {

  limit: number = 12;
  showClose: boolean = true;
  // bottom-right, bottom-left, top-right, top-left, top-center, bottom-center, center-center
  position: string = 'top-center';

  // How long (in miliseconds) the toasty shows before it's removed. Set to null/0 to turn off.
  timeout: number = 0;
}