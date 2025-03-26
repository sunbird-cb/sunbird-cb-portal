import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core'
import { Router, Event, NavigationEnd, NavigationError, ActivatedRoute } from '@angular/router'
import { ValueService } from '@sunbird-cb/utils-v2'
import { map } from 'rxjs/operators'
// tslint:disable
import _ from 'lodash'
import { Subscription } from 'rxjs';

@Component({
  selector: 'ws-app-provider-details',
  templateUrl: './provider-details.component.html',
  styleUrls: ['./provider-details.component.scss'],
})
export class ProviderDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('stickyMenu', { static: true }) menuElement!: ElementRef
  private paramSubscription: Subscription | null = null
  private querySubscription: Subscription | null = null
  sticky = false
  elementPosition: any
  sideNavBarOpened = true
  panelOpenState = false
  provider = ''
  orgId = ''
  titles = [
    { title: 'Learn', url: '/page/learn', icon: 'school', disableTranslate: false },
    { title: `All Providers`, url: `/app/learn/browse-by/provider/all-providers`, icon: '', disableTranslate: false },
    // { title: `${this.provider}`, url: `none`, icon: '' },
  ]
  unread = 0
  currentRoute = 'home'
  public screenSizeIsLtMedium = false
  isLtMedium$ = this.valueSvc.isLtMedium$
  mode$ = this.isLtMedium$.pipe(map(isMedium => (isMedium ? 'over' : 'side')))
  tabs: any
  tabsData: any
  private defaultSideNavBarOpenedSubscription: any
  @HostListener('window:scroll', ['$event'])
  handleScroll() {
    const windowScroll = window.pageYOffset
    if (windowScroll >= this.elementPosition) {
      this.sticky = true
    } else {
      this.sticky = false
    }
  }

  constructor(
    private valueSvc: ValueService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        // Remove static path /app/learn/browse-by/provider/
        // then split remaining url so that dynamic provider name is removed from the path
        const path = event.urlAfterRedirects.replace(`/app/learn/browse-by/provider/`, '').split('/')
        if (path && path.length) {
          this.provider = path[0]
          this.bindUrl(path.pop() || '')
        }
      }

      if (event instanceof NavigationError) {
        // Present error to user
        // console.log(event.error)
      }
    })
  }

  ngOnInit() {
    this.paramSubscription = this.activatedRoute.params.subscribe(async params => {
      this.provider = _.get(params, 'provider')
      this.orgId = _.get(params, 'orgId')
      this.querySubscription = this.activatedRoute.queryParams.subscribe((querData:any)=>{
        if(querData && querData.pageDetails) {
          let urlTomicrosite = `/app/learn/browse-by/provider/${this.provider}/${this.orgId}/micro-sites`
          this.titles.push({ title: this.provider, icon: '', url: urlTomicrosite,  disableTranslate: true})
          this.titles.push({ title: 'All Contents', icon: '', url: 'none', disableTranslate: false})
        } else {
          this.titles.push({ title: 'All Contents', icon: '', url: 'none', disableTranslate: false})
        }
      })
      this.initializeTabs()
    })
    
    // pageDetails
    this.defaultSideNavBarOpenedSubscription = this.isLtMedium$.subscribe(isLtMedium => {
      this.sideNavBarOpened = !isLtMedium
      this.screenSizeIsLtMedium = isLtMedium
    })
  }

  bindUrl(path: string) {
    if (path) {
      this.currentRoute = path
      if (this.titles.length > 3) {
        this.titles.pop()
      }
      // this.titles.push({ title: this.provider, icon: '', url: 'none' })
      switch (path) {
        case 'overview':
          this.titles.push({ title: 'Provider overview', icon: '', url: 'none', disableTranslate: false})
          break
        case 'all-CBP':
          break
        case 'insights':
          this.titles.push({ title: 'Insights', icon: '', url: 'none', disableTranslate: false})
          break
        default:
          break
      }
    }
  }
  public initializeTabs() {
    // tabs data is not kept in client assets because of dynamic parameter in route
    this.tabsData = [
      {
        name: 'Provider overview',
        key: 'ProviderOverview',
        badges: {
          enabled: true,
          uri: '',
        },
        enabled: false,
        routerLink: `/app/learn/browse-by/provider/${this.provider}/overview`,
      },
      {
        name: 'All CBPs',
        key: 'AllCBPs',
        badges: {
          enabled: true,
          uri: '',
        },
        enabled: true,
        routerLink: `/app/learn/browse-by/provider/${this.provider}/all-CBP`,
      },
      {
        name: 'Insights',
        key: 'Insights',
        badges: {
          enabled: true,
          uri: '',
        },
        enabled: true,
        routerLink: `/app/learn/browse-by/provider/${this.provider}/insights`,
      },
    ]
  }

  ngOnDestroy() {
    if (this.defaultSideNavBarOpenedSubscription) {
      this.defaultSideNavBarOpenedSubscription.unsubscribe()
    }
    if (this.paramSubscription) {
      this.paramSubscription.unsubscribe()
    }
    if (this.querySubscription) {
      this.querySubscription.unsubscribe()
    }
  }

}
