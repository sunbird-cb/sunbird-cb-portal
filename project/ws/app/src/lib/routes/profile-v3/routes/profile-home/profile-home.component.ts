import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core'
import { map } from 'rxjs/operators'
import { ValueService } from '@sunbird-cb/utils'
import { NsWidgetResolver } from '@sunbird-cb/resolver'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { NSProfileDataV3 } from '../../models/profile-v3.models'
import _ from 'lodash'
import { Subscription } from 'rxjs'


@Component({
  selector: 'ws-app-profile-home',
  templateUrl: './profile-home.component.html',
  styleUrls: ['./profile-home.component.scss']
})
export class ProfileHomeComponent implements OnInit, OnDestroy {
  @ViewChild('stickyMenu', { static: true }) menuElement!: ElementRef
  isLtMedium$ = this.valueSvc.isLtMedium$
  private defaultSideNavBarOpenedSubscription: any
  sideNavBarOpened = true
  public screenSizeIsLtMedium = false
  sticky = false
  currentRoute = 'all'
  banner!: NsWidgetResolver.IWidgetData<any>
  userRouteName = ''
  private routerSubscription: Subscription | null = null

  tabs!: NSProfileDataV3.IProfileTab[]
  tabsData = this.route.parent && this.route.parent.snapshot.data.pageData.data.tabs || []
  message = ''

  mode$ = this.isLtMedium$.pipe(map((isMedium: any) => (isMedium ? 'over' : 'side')))
  constructor(
    private valueSvc: ValueService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    debugger
    this.tabs = this.tabsData
    this.init()
  }
  init() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe()
    }
    this.routerSubscription = this.router.events.subscribe((event: any) => {

      if (event instanceof NavigationEnd) {
        // if (event.url.indexOf('topic') !== -1) {
        //   this.message = 'topic'
        // } else if(event.url.indexOf('current') !== -1){
        //   this.message = 'current'
        // } else if(event.url.indexOf('desired') !== -1){
        //   this.message = 'desired'
        // }
        _.each(this.tabs, t => {
          if (event.url.indexOf(t.routerLink) !== -1) {
            this.message = t.name
          }
        })
      }
    })
  }

  ngOnInit() {
    this.defaultSideNavBarOpenedSubscription = this.isLtMedium$.subscribe(isLtMedium => {
      this.sideNavBarOpened = !isLtMedium
      this.screenSizeIsLtMedium = isLtMedium
    })
  }

  ngOnDestroy() {
    if (this.defaultSideNavBarOpenedSubscription) {
      this.defaultSideNavBarOpenedSubscription.unsubscribe()
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe()
    }
  }

}
