import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core'
import { Router, Event, NavigationEnd, NavigationError } from '@angular/router'
import { ValueService } from '@sunbird-cb/utils'
import { map } from 'rxjs/operators'

@Component({
  selector: 'ws-app-provider-details',
  templateUrl: './provider-details.component.html',
  styleUrls: ['./provider-details.component.scss'],
})
export class ProviderDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('stickyMenu', { static: true }) menuElement!: ElementRef
  sticky = false
  elementPosition: any
  sideNavBarOpened = true
  panelOpenState = false
  provider = 'JPAL'
  titles = [
    { title: 'Learn', url: '/page/learn', icon: 'school' },
    {title: `All providers`, url: `/app/learn/browse-by/provider/all-providers`, icon: 'scatter_plot'},
    { title: `${this.provider}`, url: `none`, icon: '' }
  ]
  unread = 0
  currentRoute = 'home'
  public screenSizeIsLtMedium = false
  isLtMedium$ = this.valueSvc.isLtMedium$
  mode$ = this.isLtMedium$.pipe(map(isMedium => (isMedium ? 'over' : 'side')))
  tabs: any
  tabsData = [
    {
      name: 'Provider overview',
      key: 'ProviderOverview',
      badges: {
        enabled: true,
        uri: '',
      },
      enabled: true,
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
    private router: Router
  ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {

        //Remove static path /app/learn/browse-by/provider/
        // then split remaining url so that dynamic provider name is removed from the path
        this.bindUrl(event.urlAfterRedirects.replace(`/app/learn/browse-by/provider/`, '').split('/').pop() || '')
      }

      if (event instanceof NavigationError) {
        // Hide loading indicator

        // Present error to user
        // console.log(event.error)
      }
    })
  }

  ngOnInit() {
    this.defaultSideNavBarOpenedSubscription = this.isLtMedium$.subscribe(isLtMedium => {
      this.sideNavBarOpened = !isLtMedium
      this.screenSizeIsLtMedium = isLtMedium
    })
  }

  bindUrl(path: string) {
    if (path) {
      this.currentRoute = path
      if (this.titles.length > 2) {
        this.titles.pop()
      }
      switch (path) {
        case 'overview':
          this.titles.push({ title: 'Provider overview', icon: '', url: 'none' })
          break
        case 'all-CBP':
          this.titles.push({ title: 'All CBPs', icon: '', url: 'none' })
          break
        case 'insights':
          this.titles.push({ title: 'Insights', icon: '', url: 'none' })
          break
        default:
          break
      }
    }
  }

  ngOnDestroy() {
    if (this.defaultSideNavBarOpenedSubscription) {
      this.defaultSideNavBarOpenedSubscription.unsubscribe()
    }
  }

}
