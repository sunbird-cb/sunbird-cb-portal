
import { Component, OnInit, OnDestroy } from '@angular/core'
import { ActivatedRoute, Router, Event, NavigationEnd, NavigationError } from '@angular/router'
import { ValueService } from '@sunbird-cb/utils-v2'
import { map } from 'rxjs/operators'
import { NsWidgetResolver } from '@sunbird-cb/resolver'
@Component({
  selector: 'app-discuss',
  templateUrl: './discuss.component.html',
  styleUrls: ['./discuss.component.scss'],
})
export class DiscussComponent implements OnInit, OnDestroy {
  sideNavBarOpened = true
  panelOpenState = false
  titles = [{ title: 'DISCUSS', url: '/app/discussion-forum', icon: 'forum', queryParams: { page: 'home' } }]
  unread = 0
  currentRoute = 'forum'
  pageLayout: any
  banner!: NsWidgetResolver.IWidgetData<any>
  private bannerSubscription: any
  public screenSizeIsLtMedium = false
  isLtMedium$ = this.valueSvc.isLtMedium$
  mode$ = this.isLtMedium$.pipe(map(isMedium => (isMedium ? 'over' : 'side')))
  private defaultSideNavBarOpenedSubscription: any
  lastUrlPath = ''

  constructor(private valueSvc: ValueService, private route: ActivatedRoute, private router: Router) {
    this.unread = this.route.snapshot.data.unread
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        // Hide loading indicator
        // console.log(event.url)
        this.bindUrl(event.urlAfterRedirects.replace('/app/discussion-forum?page=home', ''))
      }

      if (event instanceof NavigationError) {
        // Hide loading indicator

        // Present error to user
        // console.log(event.error)
      }
    })
    this.bannerSubscription = this.route.data.subscribe(data => {
      if (data && data.pageData) {
        this.banner = data.pageData.data.banner || []
        this.pageLayout = data.pageData.data.pageLayout || []
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
    if (this.bannerSubscription) {
      this.bannerSubscription.unsubscribe()
    }
  }
  bindUrl(path: string) {
    if (path) {

      this.lastUrlPath = path.substring(path.lastIndexOf('/') + 1, path.length)
      this.currentRoute = this.lastUrlPath
      // console.log('path' + this.currentRoute)

      if (this.titles.length > 1) {
        this.titles.pop()
      }
      switch (path) {
        case 'home':
          this.titles.push({ title: 'Discussion', icon: '', url: 'none', queryParams: { page: 'home' } })
          break
        case 'categories':
          this.titles.push({ title: 'Categories', icon: '', url: 'none', queryParams: { page: 'home' } })
          break
        case 'tags':
          this.titles.push({ title: 'Tags', icon: '', url: 'none', queryParams: { page: 'home' } })
          break
        case 'leaderboard':
          this.titles.push({ title: 'Leaderboard', icon: '', url: 'none', queryParams: { page: 'home' } })
          break
        case 'my-discussions':
          this.titles.push({ title: 'Your Discussions', icon: '', url: 'none', queryParams: { page: 'home' } })
          break

        default:
          break
      }
    }
  }
}
