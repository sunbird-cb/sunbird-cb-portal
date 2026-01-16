import { Component, OnInit, Input } from '@angular/core'
/* tslint:disable*/

@Component({
  selector: 'ws-app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss'],
})
export class LeftMenuComponent implements OnInit {

  @Input()
  tabsData!: any
  disableMenu = false
  constructor(
  ) {
  }

  ngOnInit(): void {

  }
}
