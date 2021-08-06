import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
// import { BreakpointObserver } from '@angular/cdk/layout'
// import { DomSanitizer } from '@angular/platform-browser'
// import { ConfigurationsService } from '@sunbird-cb/utils'

@Component({
  selector: 'app-discuss-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss'],
})
export class LeftMenuComponent implements OnInit {
  @Input() unseen = 0
  @Input() tabsData: any = []
  @Output() currentTab = new EventEmitter<any>()

  ngOnInit(): void {
  }
  onChangeTab(tabName: any) {
    this.currentTab.emit(tabName)
  }
}
