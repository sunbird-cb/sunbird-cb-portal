import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { map } from 'rxjs/operators'
import { ValueService } from '@sunbird-cb/utils'
import { NsWidgetResolver } from '@sunbird-cb/resolver'
import { ActivatedRoute, Router, Event, NavigationEnd, NavigationError } from '@angular/router';
import { NSKnowledgeResource } from '../../models/knowledge-resource.models';

@Component({
  selector: 'ws-app-knowledge-home',
  templateUrl: './knowledge-home.component.html',
  styleUrls: ['./knowledge-home.component.scss']
})
export class KnowledgeHomeComponent implements OnInit {
  @ViewChild('stickyMenu', { static: true }) menuElement!: ElementRef
  isLtMedium$ = this.valueSvc.isLtMedium$
  private defaultSideNavBarOpenedSubscription: any
  sideNavBarOpened = true
  public screenSizeIsLtMedium = false
  sticky = false
  currentRoute = 'all'
  banner!: NsWidgetResolver.IWidgetData<any>
  titles = [{ title: 'knowledge resource', url: '/app/knowledge-resource/all', icon: 'menu_book' }]
  userRouteName = ''

  tabs: any
  tabsData: NSKnowledgeResource.IKnowledgeResourceTab[]
  private bannerSubscription: any

  mode$ = this.isLtMedium$.pipe(map((isMedium: any) => (isMedium ? 'over' : 'side')))

  constructor(
    private valueSvc: ValueService,
    private router: Router,
    private route: ActivatedRoute
    ) {


    this.tabsData = this.route.parent && this.route.parent.snapshot.data.pageData.data.tabs || []
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.bindUrl(event.url.replace('/app/knowledge-resource/all', ''))
      }
      if (event instanceof NavigationError) {
      }
    })
    this.bannerSubscription = this.route.data.subscribe(data => {
      if (data && data.pageData) {
        this.banner = data.pageData.data.banner || []
      }
    })
  }

    bindUrl(path: string) {
      if (path) {
        this.currentRoute = path
        if (this.titles.length > 1) {
          this.titles.pop()
        }
        switch (path) {
          case 'all':
            // this.titles.push({ title: 'Network', icon: '', url: 'none' })
            break
          case 'saved':
            this.titles.push({ title: 'saved', icon: '', url: 'none' })
            break


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

    console.log(this.banner);
  }

  ngOnDestroy() {
    if (this.defaultSideNavBarOpenedSubscription) {
      this.defaultSideNavBarOpenedSubscription.unsubscribe()
    }
    if (this.bannerSubscription) {
      this.bannerSubscription.unsubscribe()
    }
  }


}
