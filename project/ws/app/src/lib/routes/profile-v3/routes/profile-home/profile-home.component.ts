import { Component, OnInit,ElementRef, ViewChild } from '@angular/core'
import { map } from 'rxjs/operators'
import { ValueService } from '@sunbird-cb/utils'
import { NsWidgetResolver } from '@sunbird-cb/resolver'
import { ActivatedRoute, Router, Event, NavigationEnd, NavigationError } from '@angular/router'
import { NSProfileDataV3 } from '../../models/profile-v3.models'

@Component({
  selector: 'ws-app-profile-home',
  templateUrl: './profile-home.component.html',
  styleUrls: ['./profile-home.component.scss']
})
export class ProfileHomeComponent implements OnInit {
  @ViewChild('stickyMenu', { static: true }) menuElement!: ElementRef
  isLtMedium$ = this.valueSvc.isLtMedium$
  private defaultSideNavBarOpenedSubscription: any
  sideNavBarOpened = true
  public screenSizeIsLtMedium = false
  sticky = false
  currentRoute = 'all'
  banner!: NsWidgetResolver.IWidgetData<any>
  userRouteName = ''

  tabs: any
  tabsData: NSProfileDataV3.IProfileTab[]


  mode$ = this.isLtMedium$.pipe(map((isMedium: any) => (isMedium ? 'over' : 'side')))
  constructor(
    private valueSvc: ValueService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.tabsData = this.route.parent && this.route.parent.snapshot.data.pageData.data.tabs || []
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        console.log(event.url + '+++++++++++++++++ event url')
        this.bindUrl(event.url.replace('/app/registration/', ''))
      }
      if (event instanceof NavigationError) {
      }
    })

  }

  bindUrl(path: string) {
    if (path) {
      this.currentRoute = path

      switch (path) {
        case 'current-competencies':
          // this.titles.push({ title: 'Network', icon: '', url: 'none' })
          break
        // case 'saved':
        //   this.titles.push({ title: 'saved', icon: '', url: 'none' })
        //   break

        default:
          break
      }
    }
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
  }

}
