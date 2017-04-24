import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'gx-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() name : string;
  @Input() trace : string;
  @Input() fixed : boolean = false;
  @Input() control : boolean = true;

  constructor() { }

  ngOnInit() {
  }

}
