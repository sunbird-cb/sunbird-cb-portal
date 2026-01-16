import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { NsWidgetResolver, WidgetBaseComponent } from '@sunbird-cb/resolver'
import { ILeftMenu, IMenu } from './left-menu.model'
import { MultilingualTranslationsService } from '@sunbird-cb/utils-v2'
import { TranslateService } from '@ngx-translate/core'
// tslint:disable-next-line: import-spacing
// import  defaultImg  from './base64.json'
@Component({
  selector: 'ws-widget-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss'],
})
export class LeftMenuComponent extends WidgetBaseComponent
  implements OnInit, OnDestroy, NsWidgetResolver.IWidgetData<ILeftMenu>  {
  @Input() widgetData!: ILeftMenu
  currentFragment = ''
  defaultImg = '/assets/instances/eagle/app_logos/default.png'
  // @Input() Source
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private langtranslations: MultilingualTranslationsService) {
    super()
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
  }
  ngOnDestroy(): void {
    // throw new Error('Method not implemented.')
  }

  ngOnInit(): void {
    this.activatedRoute.fragment.subscribe((fragment: any) => {
      this.currentFragment = fragment
    })
  }
  get defaultImage() {
    // tslint:disable
    // console.log('defaultImage')
    // tslint:enable
    return this.defaultImg
  }
  changeToDefaultImg($event: any) {
    // tslint:disable
    // console.log('changeToDefaultImg')
    // tslint:enable
    $event.target.src = this.defaultImg
  }
  public isLinkActive(url: string, index: number): boolean {
    let returnVal = false
    if (this.currentFragment) {
      if (url) {
        returnVal = (this.activatedRoute.snapshot.fragment === url)
        // else if (index === 0 && this.widgetData.menus) {
        //   returnVal = true
        // }
      } else {
        returnVal = false
      }
    } else {
      returnVal = !!(this.widgetData.menus[index].isDefaultSelected)
    }

    return returnVal
  }
  public isLinkActive2(url?: string): boolean {
    let returnval = false
    if (url) {
      const st = this.router.url.split('?')
      if (st && st[0] && st[0] === (url)) {
        returnval = true
      }
      // if(route.url.con)
    }
    return returnval
  }
  getLink(tab: IMenu) {
    if (tab && tab.customRouting && this.activatedRoute.snapshot && this.activatedRoute.snapshot.firstChild && tab.paramaterName) {
      return (tab.routerLink.replace('<param>', this.activatedRoute.snapshot.firstChild.params[tab.paramaterName]))
    }
    return
  }

  isAllowed(tab: IMenu): boolean {
    let returnValue = false
    if (tab.requiredRoles && tab.requiredRoles.length > 0) {
      (tab.requiredRoles).forEach(v => {
        if ((this.widgetData.userRoles || new Set()).has(v)) {
          returnValue = true
        }
      })
    } else {
      returnValue = true
    }
    return returnValue
  }

  translateLabels(label: string, type: any) {
    return this.langtranslations.translateLabelWithoutspace(label, type, '')
  }
}
