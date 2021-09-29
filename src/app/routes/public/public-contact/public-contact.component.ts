import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener, AfterViewInit } from '@angular/core'
import { ConfigurationsService, NsPage } from '@sunbird-cb/utils'
import { Subscription } from 'rxjs'
import { ActivatedRoute } from '@angular/router'
// tslint:disable-next-line: import-name
import _ from 'lodash'

@Component({
  selector: 'ws-public-contact',
  templateUrl: './public-contact.component.html',
  styleUrls: ['./public-contact.component.scss'],
})
export class PublicContactComponent implements OnInit, AfterViewInit, OnDestroy {
  contactUsMail = ''
  contactPage: any
  platform = 'iGot'
  panelOpenState = false
  currentTab = 'personalInfo'
  tabsData!: any
  elementPosition: any
  sticky = false
  @ViewChild('stickyMenu', { static: true }) menuElement!: ElementRef

  pageNavbar: Partial<NsPage.INavBackground> = this.configSvc.pageNavBar
  private subscriptionContact: Subscription | null = null
  @HostListener('window:scroll', ['$event'])
  handleScroll() {
    const windowScroll = window.pageYOffset
    if (windowScroll >= this.elementPosition) {
      this.sticky = true
    } else {
      this.sticky = false
    }
  }
  constructor(private configSvc: ConfigurationsService, private activateRoute: ActivatedRoute) { }

  ngOnInit() {
    this.subscriptionContact = this.activateRoute.data.subscribe(data => {
      this.contactPage = data.pageData.data
      const menus = _.map(_.get(this.contactPage, 'help'), (menu: any, idx: number) => {
        return {
          name: menu.title,
          key: menu.fragment,
          isDefaultSelected: (idx === 0),
          render: true,
          fragment: menu.fragment,
          badges: {
            enabled: true,
            uri: '',
          },
          enabled: true,
          routerLink: '/public/faq',
          customRouting: false,
        }
      })
      this.tabsData = {
        menus,
        logo: false,
        logoPath: null,
        name: '',
        userRoles: [],
      }
    })
    if (this.configSvc.instanceConfig) {
      this.contactUsMail = this.configSvc.instanceConfig.mailIds.contactUs
    }
  }
  ngAfterViewInit() {
    this.elementPosition = this.menuElement.nativeElement.parentElement.offsetTop
  }
  ngOnDestroy() {
    if (this.subscriptionContact) {
      this.subscriptionContact.unsubscribe()
    }
  }
  onSideNavTabClick(id: string) {
    this.currentTab = id
    const el = document.getElementById(id)
    if (el != null) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' })
    }
  }
}
