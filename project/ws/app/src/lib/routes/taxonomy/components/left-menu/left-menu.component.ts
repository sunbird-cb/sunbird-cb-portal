import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core'
import { Subscription } from 'rxjs/internal/Subscription'
// import { BreakpointObserver } from '@angular/cdk/layout'
// import { DomSanitizer } from '@angular/platform-browser'
// import { ConfigurationsService } from '@sunbird-cb/utils'

@Component({
  selector: 'app-discuss-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss'],
})
export class LeftMenuComponent implements OnInit, OnDestroy {
  @Input() unseen = 0
  @Input() tabsData: any = []
  @Output() currentTab = new EventEmitter<string>()
  private tabs: Subscription | null = null

  ngOnInit(): void {
  }
  ngOnDestroy() {
    if (this.tabs) {
      this.tabs.unsubscribe()
    }
  }
  onChangeTab(tabName: string) {
    this.currentTab.emit(tabName)
  }
}
