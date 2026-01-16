import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core'
import { NsWidgetResolver, WidgetBaseComponent } from '@sunbird-cb/resolver'
import { ConfigurationsService, EventService, NsInstanceConfig, MultilingualTranslationsService } from '@sunbird-cb/utils-v2'
import { NsContent } from '../_services/widget-content.model'
import { NsCardContent } from './event-card-v2.model'
/* tslint:disable*/
import _ from 'lodash'
import { TranslateService } from '@ngx-translate/core'
import { Router } from '@angular/router'

@Component({
  selector: 'ws-widget-event-card-v2',
  templateUrl: './event-card-v2.component.html',
  styleUrls: ['./event-card-v2.component.scss'],
})
export class EventCardV2Component extends WidgetBaseComponent
  implements OnInit, NsWidgetResolver.IWidgetData<NsCardContent.ICard> {
  @Input() widgetData!: NsCardContent.ICard
  @Output() handleTelemetry = new EventEmitter<any>()
  @HostBinding('id')
  primaryCategory = NsContent.EPrimaryCategory
  acbpConstants = NsCardContent.ACBPConst
  public id = `ws-card_${Math.random()}`
  forPreview = window.location.href.includes('/public/') || window.location.href.includes('&preview=true')
  defaultThumbnail = ''
  defaultSLogo = ''
  event: any

  sourceLogos: NsInstanceConfig.ISourceLogo[] | undefined

  isIntranetAllowedSettings = false
  constructor(
    private events: EventService,
    private configSvc: ConfigurationsService,
    private langtranslations: MultilingualTranslationsService,
    private translate: TranslateService,
    private router: Router

  ) {
    super()
    this.langtranslations.languageSelectedObservable.subscribe(() => {
      if (localStorage.getItem('websiteLanguage')) {
        this.translate.setDefaultLang('en')
        const lang = localStorage.getItem('websiteLanguage')!
        this.translate.use(lang)
      }
    })
  }

  async getRedirectUrlData(content: any) {
    this.handleTelemetry.emit(content)
    this.router.navigate([`/app/event-hub/home/${content.identifier}`])
  }
  ngOnInit() {
    // this.widgetInstanceId=his.id
    const instanceConfig = this.configSvc.instanceConfig
    if (instanceConfig) {
      this.defaultThumbnail = instanceConfig.logos.defaultContent || ''
      this.sourceLogos = instanceConfig.sources
      this.defaultSLogo = instanceConfig.logos.defaultSourceLogo || ''
    }
    this.event = this.widgetData.content
  }

  getTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}hr ${remainingMinutes}mins`;
  }

  getStartDate(startDate: any, startTime: any) {
    return `${startDate} ${startTime}`
  }

  redirectToUrl() {
    let url = window.location.href
    let indexValue = url.split('curatedCollections/')
    window.location.href = indexValue[0] + 'curatedCollections/' + this.widgetData.content.identifier

  }
  raiseTelemetry() {
    this.events.raiseInteractTelemetry(
      {
        type: 'click',
        subType: `${this.widgetType}-${this.widgetSubType}`,
        id: `${_.camelCase(this.widgetData.content.primaryCategory)}-card`,
      },
      {
        id: this.widgetData.content.identifier,
        type: this.widgetData.content.primaryCategory,
        //context: this.widgetData.context,
        rollup: {},
        ver: `${this.widgetData.content.version}${''}`,
      },
      {
        pageIdExt: `${_.camelCase(this.widgetData.content.primaryCategory)}-card`,
        module: _.camelCase(this.widgetData.content.primaryCategory),
      })
  }

  translateLabels(label: string, type: any, subtype: any) {
    return this.langtranslations.translateLabelWithoutspace(label, type, subtype)
  }

  translateLabel(label: string, type: any) {
    return this.langtranslations.translateLabel(label, type, '')
  }

}