import { Directive, ElementRef, Input, Renderer, HostListener } from '@angular/core';

@Directive({
  selector: '[enterDefault]'
})
export class PreventEnterDirective {

  @Input('enterDefault') elementId: string;
  
  constructor(private el: ElementRef, private renderer: Renderer) { }

  @HostListener('keypress', ['$event']) onMouseEnter(evt) {
    defaultEnterKey(evt, this.elementId)
  }
}

function defaultEnterKey(evt, elem) {
  let node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
  if ((evt.keyCode == 13) && (node.type == "text")) {
    if (elem) {
      document.getElementById(elem).click();
    }
    evt.preventDefault();
  }
} 
