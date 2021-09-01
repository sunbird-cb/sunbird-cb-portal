import { Component, OnInit, OnDestroy, Input } from '@angular/core'

@Component({
  selector: 'ws-app-provider-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss'],
})
export class ProviderLeftMenuComponent implements OnInit, OnDestroy {

  @Input()
  tabsData!: any
  constructor() { }

  ngOnInit(): void {
  }
  ngOnDestroy() {

  }

}
