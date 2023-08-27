import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Event, NavigationEnd, NavigationError} from '@angular/router';
import { NsWidgetResolver } from '@sunbird-cb/resolver';

@Component({
  selector: 'ws-app-organization-home',
  templateUrl: './organization-home.component.html',
  styleUrls: ['./organization-home.component.scss']
})
export class OrganizationHomeComponent implements OnInit {
  banner!: NsWidgetResolver.IWidgetData<any>
  currentRoute = 'dopt'
  titles = [{ title: 'Register for Inservice Training Program 2023-24', url: '/app/organisation/dopt', icon: '' }]
  private bannerSubscription: any

  constructor(private route: ActivatedRoute, private router: Router,) { 
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.bindUrl(event.url.replace('app/organisation/dopt', ''))
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
        case 'dopt':
          // this.titles.push({ title: 'Network', icon: '', url: 'none' })
          break
       

        default:
          break
      }
    }
  }

  ngOnInit() {

   
  }

  ngOnDestroy() {

    if (this.bannerSubscription) {
      this.bannerSubscription.unsubscribe()
    }
  }

}
