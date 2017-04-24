import { BundleService } from './bundle.service';
import { Directive, ElementRef, Renderer, Inject, OnInit, Input } from '@angular/core';

import { Bundle } from './bundle.interface';

@Directive({
  selector: '[bundle]'
})
export class BundleDirective implements OnInit {

  _options: Bundle = {};

  constructor(private el: ElementRef, 
          private renderer: Renderer,
          private bundle: BundleService) {}
 
  ngOnInit() {
      let label = this.bundle.getBundle('', this._options.group, this._options.key, this._options.args);
      this.el.nativeElement.innerHTML = label;
  }

  @Input('bundle')
  set options(options : string) {
    this._options = JSON.parse(options.replace(/\'/g, '\"'));
  };

  get options(){
    return JSON.stringify(this._options);
  }

}
