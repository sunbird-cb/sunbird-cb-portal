import { Component, Input, OnInit } from '@angular/core'
import { delay } from 'rxjs/operators'
import { HeaderService } from './header.service'
import { MobileAppsService } from '../../services/mobile-apps.service'
import {
  ValueService,
} from '@sunbird-cb/utils-v2'
@Component({
  selector: 'ws-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isXSmall$ = this.valueSvc.isXSmall$
  isNavBarRequired = true
  showNavbar = true
  widgetData = {}
  mobileTopHeaderVisibilityStatus = true
  @Input() mode: any
  @Input() headerFooterConfigData: any
  @Input() showHubs = false
  constructor(
    private valueSvc: ValueService,
    public headerService: HeaderService,
    public mobileAppsService: MobileAppsService) { }

  ngOnInit() {
    this.headerService.showNavbarDisplay$.pipe(delay(500)).subscribe(display => {
      this.showNavbar = display
    })

    // tslint:disable-next-line: whitespace
    this.widgetData = { // tslint:disable-next-line: whitespace
      widgets: [
        [
          {
            dimensions: {},
            className: 'ws-mat-primary-lite-background-important new-box-hubs',
            widget: {
              widgetType: 'card',
              widgetSubType: 'cardHomeHubs',
              widgetData: {},
            },
          },
        ],
      ],
    } // tslint:disable-next-line: whitespace
  } // tslint:disable-next-line: whitespace

  downloadApp(): void {
    const userAgent = navigator.userAgent
    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
      window.open('https://play.google.com/store/apps/details?id=com.igot.karmayogibharat&hl=en&gl=US', '_blank')
    }

    if (/android/i.test(userAgent)) {
        window.open('https://play.google.com/store/apps/details?id=com.igot.karmayogibharat&hl=en&gl=US', '_blank')
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent)) {
        window.open('https://apps.apple.com/in/app/igot-karmayogi/id6443949491', '_blank')
    }
  }

  get navBarRequired(): boolean {
    // tslint:disable-next-line: whitespace
    return this.isNavBarRequired
  }

  get isShowNavbar(): boolean {
    return this.showNavbar
  }

  hideMobileTopHeader() {
    this.mobileTopHeaderVisibilityStatus = false
    this.mobileAppsService.mobileTopHeaderVisibilityStatus.next(this.mobileTopHeaderVisibilityStatus)
  }
}
