import { Directive, ElementRef, Renderer, Inject, OnInit } from '@angular/core';

@Directive({
  selector: '[autofocus]'
})
export class AutofocusDirective implements OnInit {

  constructor(private el: ElementRef, private renderer: Renderer) {}
 
  ngOnInit() {
      this.el.nativeElement.focus();
  }

}
