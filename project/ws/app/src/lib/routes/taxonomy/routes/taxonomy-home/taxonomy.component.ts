
import { Component, OnInit, OnDestroy } from '@angular/core'
import { ActivatedRoute, Router, Event, NavigationEnd, NavigationError } from '@angular/router'
import { ValueService } from '@sunbird-cb/utils-v2'
import { map } from 'rxjs/operators'
import { NsWidgetResolver } from '@sunbird-cb/resolver'
import { TaxonomyService } from '../../services/taxonomy.service'
const APP_TAXONOMY = `/app/taxonomy/`
@Component({
  selector: 'app-taxonomy',
  templateUrl: './taxonomy.component.html',
  styleUrls: ['./taxonomy.component.scss'],
})
export class TaxonomyHomeComponent implements OnInit, OnDestroy {
  sideNavBarOpened = true
  panelOpenState = false
  resourceLoading = true
  termsTopicArray: any
  titles = [{ title: 'DISCUSS', url: '/app/discuss/home', icon: 'forum' }]
  unread = 0
  currentRoute = 'home'
  banner!: NsWidgetResolver.IWidgetData<any>
  private bannerSubscription: any
  public screenSizeIsLtMedium = false
  isLtMedium$ = this.valueSvc.isLtMedium$
  mode$ = this.isLtMedium$.pipe(map(isMedium => (isMedium ? 'over' : 'side')))
  private defaultSideNavBarOpenedSubscription: any

  constructor(private valueSvc: ValueService, private route: ActivatedRoute, private router: Router, private _service:  TaxonomyService) {
    this.unread = this.route.snapshot.data.unread
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        // Hide loading indicator
        // console.log(event.url)

      }

      if (event instanceof NavigationError) {
        // Hide loading indicator

        // Present error to user
        // console.log(event.error)
      }
    })
    // this.bannerSubscription = this.route.data.subscribe(data => {
    //   if (data && data.pageData) {
    //     this.banner = data.pageData.data.banner || []
    //   }
    // })
  }
  gotoNextLevel(topic: any) {
    this.router.navigate([APP_TAXONOMY + topic.name])
  }
  ngOnInit() {
    localStorage.removeItem('isFirstTab')
    localStorage.removeItem('currentTab')

    this.getAllTopics()
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
  getAllTopics() {
    this._service.fetchAllTopics().subscribe(response => {
      this.termsTopicArray = response.terms
      this.resourceLoading = false
    })
  }

}
