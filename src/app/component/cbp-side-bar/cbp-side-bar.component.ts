import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ws-cbp-side-bar',
  templateUrl: './cbp-side-bar.component.html',
  styleUrls: ['./cbp-side-bar.component.scss']
})
export class CbpSideBarComponent implements OnInit {

  @Input() cbpCount: any
  @Input() upcommingList: any
  @Input() overDueList: any

  constructor() { }

  ngOnInit() {
  }

}
