import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'gx-tooltip',
  template: `
    <span title="Campo obrigatório" class="text-danger ml-2" 
        *ngIf="required">&#10033;</span> 

    <span title="{{ tip }}" class="text-info font-weight-bold" 
        *ngIf="tip.length > 0">?</span>  
  `,
  styleUrls: ['./tooltip.component.css']
})
export class TooltipComponent  {
  @Input() tip : string = '';
  @Input() required : boolean = false;

  constructor() { }

}