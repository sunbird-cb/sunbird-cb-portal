import { animate, style, transition, trigger } from '@angular/animations'
import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core'
import { Router } from '@angular/router'
import { NsWidgetResolver, WidgetBaseComponent } from '@sunbird-cb/resolver'
import { ConfigurationsService, NsInstanceConfig } from '@sunbird-cb/utils-v2'
import { BreadcrumbsOrgService } from './breadcrumbs-org.service'

type TUrl = undefined | 'none' | 'back' | string
const APP_TAXONOMY = `/app/taxonomy/`
@Component({
  selector: 'ws-widget-breadcrumbs-org',
  templateUrl: './breadcrumbs-org.component.html',
  styleUrls: ['./breadcrumbs-org.component.scss'],
  animations: [
    trigger(
      'enterAnimation', [
      transition(':enter', [
        style({ transition: 'visibility 0s linear 0.23s, opacity 0.33s linear', opacity: 0 }),
        animate('300ms', style({ transition: 'visibility 0s linear 0.23s, opacity 0.33s linear', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ transition: 'visibility 0s linear 0.23s, opacity 0.33s linear', opacity: 1 }),
        animate('300ms', style({ transition: 'visibility 0s linear 0.23s, opacity 0.33s linear', opacity: 0 })),
      ]),
    ]
    ),
  ],
})
export class BreadcrumbsOrgComponent extends WidgetBaseComponent
  implements OnInit, NsWidgetResolver.IWidgetData<{ url: TUrl }> {
  @Input() widgetData: { url: TUrl, titles?: NsWidgetResolver.ITitle[]
     | undefined, data: any, tab: any } =
  { url: 'none', titles: [], data: null, tab: null }
  presentUrl = ''
  topicKey: any = []
  @HostBinding('id')
  public id = 'nav-back'
  visible = false
  @Output() nextLevelTopic = new EventEmitter<any>()
  @Output() firstLevelTopic = new EventEmitter<any>()
  @Output() currentSelection = new EventEmitter<any>()
  nextLvlObj: any
  currentTab: any
  enablePeopleSearch = true
  hubsList!: NsInstanceConfig.IHubs[]
  constructor(
    private btnBackSvc: BreadcrumbsOrgService,
    private router: Router,
    private configSvc: ConfigurationsService,
  ) {
    super()
  }

  ngOnInit() {
    this. currentTab = this.widgetData.tab
    const instanceConfig = this.configSvc.instanceConfig
    if (instanceConfig) {
      this.hubsList = (instanceConfig.hubs || []).filter(i => i.active)
    }
    this.presentUrl = this.router.url

  }

  get backUrl(): { fragment?: string; routeUrl: string; queryParams: any } {
    if (this.presentUrl === '/page/explore') {
      return {
        queryParams: undefined,
        routeUrl: '/app/home',
      }
    }
    if (this.widgetData.url === 'home') {
      return {
        queryParams: undefined,
        routeUrl: '/app/home',
      }
    }
    if (this.widgetData.url === 'doubleBack') {
      return {
        fragment: this.btnBackSvc.getLastUrl(2).fragment,
        queryParams: this.btnBackSvc.getLastUrl(2).queryParams,
        routeUrl: this.btnBackSvc.getLastUrl(2).route,
      }
    }
    if (this.widgetData.url === 'back') {
      return {
        fragment: this.btnBackSvc.getLastUrl().fragment,
        queryParams: this.btnBackSvc.getLastUrl().queryParams,
        routeUrl: this.btnBackSvc.getLastUrl().route,
      }
    }
    if (this.widgetData.url !== 'back' && this.widgetData.url !== 'doubleBack') {
      this.btnBackSvc.checkUrl(this.widgetData.url)
    }

    return {
      queryParams: undefined,
      routeUrl: this.widgetData.url ? this.widgetData.url : '/app/home',
    }
  }
  // get titleUrl(): { fragment?: string; routeUrl: string; queryParams: any } {
  //   return {
  //     queryParams: undefined,
  //     routeUrl: this.widgetData.url ? this.widgetData.url : '/app/home',
  //   }
  // }
  toggleVisibility() {
    this.visible = !this.visible
  }
  clickedTab(tab: any) {
    this.currentSelection.emit(tab)
  }
  // createLeftMenuAndData(currentObj: any, topic:any){
  //   const firstLvlArray: any[] = []
  //   const tempCurrentArray: any[] = []
  //   const nextLevel: string[] = []
  //   currentObj.forEach((term: any) => {
  //     if (term.name !== decodeURI(topic)) {
  //       firstLvlArray.push(this.createTermObject(term))
  //       } else {
  //       firstLvlArray.splice(0, 0, this.createTermObject(term))
  //     }
  //     this.currentTab = term.name
  //       if (term.name === decodeURI(topic) && term.children) {
  //         this.getSecondLevelTopic(term)

  //         term.children.forEach((second: any) => {
  //           nextLevel.push(second.name)
  //           tempCurrentArray.push(second)
  //         })
  //       }
  //   })
  //   this.firstLevelTopic.emit(firstLvlArray)
  //   this.nextLevelTopic.emit(nextLevel)
  // }
  getSecondLevelTopic(allLevelObject: any) {
    this.topicKey = []
    if (allLevelObject.identifier) {
    this.topicKey.push(allLevelObject.identifier)
    }
    // this. getAllRelatedCourse()
  }
  // getAllRelatedCourse() {
  //   this.relatedResource = []
  //   this.loader.changeLoad.next(true)
  //     this._service.fetchAllRelatedCourse(this.topicKey).subscribe(response => {
  //       const tempRequestParam: { content: any }[] = []
  //       if (response.result.content) {
  //       response.result.content.forEach((course: any) => {
  //         if (course.status === 'Live') {
  //        const temobj = {
  //          content: course,
  //        }
  //        tempRequestParam.push(temobj)
  //       }
  //       })
  //       this.relatedResource = tempRequestParam
  //     }

  //     })
  //   }
  createTermObject(termObj: any) {
    const termObject = {
      name: decodeURI(termObj.name),
      enabled: true,
      identifier: termObj.identifier,
      routerLink: APP_TAXONOMY + termObj.name.replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, ''),
    }
    return termObject
  }
}
