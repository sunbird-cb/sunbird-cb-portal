import { AfterViewInit, Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core'
import { MatDialog, MatSnackBar } from '@angular/material'
import { NsWidgetResolver, WidgetBaseComponent } from '@sunbird-cb/resolver'
import { ConfigurationsService, EventService, UtilityService, NsInstanceConfig, MultilingualTranslationsService, WsEvents } from '@sunbird-cb/utils-v2'
import { Subscription } from 'rxjs'
import { NsGoal } from '../btn-goals/btn-goals.model'
import { NsPlaylist } from '../btn-playlist/btn-playlist.model'
import { NsContent } from '../_services/widget-content.model'
import { NsCardContent } from './card-content-v2.model'
/* tslint:disable*/
import _ from 'lodash'
import { CertificateService } from '@ws/app/src/lib/routes/certificate/services/certificate.service'
import { CertificateDialogComponent } from '../_common/certificate-dialog/certificate-dialog.component'
import { TranslateService } from '@ngx-translate/core'
import { WidgetContentLibService } from '@sunbird-cb/consumption'
import { Router } from '@angular/router'
import { VIEWER_ROUTE_FROM_MIME } from '../_services/viewer-route-util'
// import { Router } from '@angular/router'

@Component({
  selector: 'ws-widget-card-content-v2',
  templateUrl: './card-content-v2.component.html',
  styleUrls: ['./card-content-v2.component.scss'],
})
export class CardContentV2Component extends WidgetBaseComponent
  implements OnInit, OnDestroy, AfterViewInit, NsWidgetResolver.IWidgetData<NsCardContent.ICard> {
  @Input() widgetData!: NsCardContent.ICard
  @HostBinding('id')
  primaryCategory = NsContent.EPrimaryCategory
  acbpConstants = NsCardContent.ACBPConst
  public id = `ws-card_${Math.random()}`
  forPreview = window.location.href.includes('/public/') || window.location.href.includes('&preview=true')
  defaultThumbnail = ''
  defaultSLogo = ''
  showFlip = false
  isCardFlipped = false
  showIsMode = false
  showContentTag = false
  downloadCertificateLoading: boolean = false
  cbPlanMapData: any
  cbPlanInterval: any
  nsContentConstants: any = NsContent
  btnPlaylistConfig: NsPlaylist.IBtnPlaylist | null = null
  btnGoalsConfig: NsGoal.IBtnGoal | null = null
  prefChangeSubscription: Subscription | null = null
  sourceLogos: NsInstanceConfig.ISourceLogo[] | undefined
  
  isIntranetAllowedSettings = false
  constructor(
    private dialog: MatDialog,
    private events: EventService,
    private configSvc: ConfigurationsService,
    private utilitySvc: UtilityService,
    private snackBar: MatSnackBar,
    private langtranslations: MultilingualTranslationsService,
    private certificateService: CertificateService,
    private translate: TranslateService,
    private contSvc: WidgetContentLibService,
    private router: Router,

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

  ngOnInit() {
    // this.widgetInstanceId=his.id
    this.isIntranetAllowedSettings = this.configSvc.isIntranetAllowed
    this.prefChangeSubscription = this.configSvc.prefChangeNotifier.subscribe(() => {
      this.isIntranetAllowedSettings = this.configSvc.isIntranetAllowed
    })

    const instanceConfig = this.configSvc.instanceConfig
    if (instanceConfig) {
      this.defaultThumbnail = instanceConfig.logos.defaultContent || ''
      this.sourceLogos = instanceConfig.sources
      this.defaultSLogo = instanceConfig.logos.defaultSourceLogo || ''
    }

    if (this.widgetData) {
      if (this.widgetData.context && this.widgetData.context.pageSection === 'curatedCollections') {
        this.widgetData.content.linkUrl = '/app/curatedCollections/'+ this.widgetData.content.identifier
      }
      if(this.widgetData && this.widgetData.content) {
        this.btnPlaylistConfig = {
          contentId: this.widgetData.content.identifier,
          contentName: this.widgetData.content.name,
          contentType: this.widgetData.content.contentType,
          primaryCategory: this.widgetData.content.primaryCategory,
          mode: 'dialog',
        }
        this.btnGoalsConfig = {
          contentId: this.widgetData.content.identifier,
          contentName: this.widgetData.content.name,
          contentType: this.widgetData.content.contentType,
          primaryCategory: this.widgetData.content.primaryCategory,
        }
      }
      this.modifySensibleContentRating()
    }

  if(this.widgetData && this.widgetData.content) {

      // required for knowledge board
      // TODO: make it more generic
      this.showFlip = Boolean(this.widgetData.content.reason)
      if (this.widgetData.content.mode) {
        this.showIsMode = this.isLatest(this.convertToISODate(this.widgetData.content.addedOn))
      }
      if (this.widgetData.contentTags) {
        this.showContentTag =
          this.checkCriteria() && this.checkContentTypeCriteria() && this.checkMimeTypeCriteria()
      }
    }
    this.cbPlanInterval = setInterval(() => {
      this.getCbPlanData()
    },                                1000)
  }

  checkContentTypeCriteria() {
    if (
      this.widgetData.contentTags &&
      this.widgetData.contentTags.excludeContentType &&
      this.widgetData.contentTags.excludeContentType.length
    ) {
      return !this.widgetData.contentTags.excludeContentType.includes(
        this.widgetData.content.contentType,
      )
    }
    return true
  }

  redirectToUrl() {
    let url = window.location.href
    let indexValue = url.split('curatedCollections/')
    window.location.href = indexValue[0] + 'curatedCollections/'  + this.widgetData.content.identifier

  }

  checkMimeTypeCriteria() {
    if (
      this.widgetData.contentTags &&
      this.widgetData.contentTags.excludeMimeType &&
      this.widgetData.contentTags.excludeMimeType.length
    ) {
      return !this.widgetData.contentTags.excludeMimeType.includes(this.widgetData.content.mimeType)
    }
    return true
  }

  checkCriteria() {
    if (
      this.widgetData.contentTags &&
      this.widgetData.contentTags.criteriaField &&
      this.widgetData.contentTags.daysSpan
    ) {
      const dateOffset = 24 * 60 * 60 * 1000 * this.widgetData.contentTags.daysSpan
      const lastDay = new Date()
      lastDay.setTime(lastDay.getTime() - dateOffset)
      if (
        this.convertToISODate(
          this.widgetData.content[this.widgetData.contentTags.criteriaField],
        ).getTime() >= lastDay.getTime()
      ) {
        return true
      }
      return false
    }
    return true
  }

  ngOnDestroy() {
    if (this.prefChangeSubscription) {
      this.prefChangeSubscription.unsubscribe()
    }
  }

  ngAfterViewInit() {
    // this.assignThumbnail()
  }

  get checkDisplayName(): string {
    if (this.widgetData.content.creatorDetails && this.widgetData.content.creatorDetails.length) {
      if (
        !this.widgetData.content.creatorDetails[0].name ||
        this.widgetData.content.creatorDetails[0].name === '' ||
        this.widgetData.content.creatorDetails[0].name === 'null null'
      ) {
        return 'Not Disclosed'
      }
      return this.widgetData.content.creatorDetails[0].name
    }
    if (this.widgetData.content.creatorContacts && this.widgetData.content.creatorContacts.length) {
      if (
        !this.widgetData.content.creatorContacts[0].name ||
        this.widgetData.content.creatorContacts[0].name === '' ||
        this.widgetData.content.creatorContacts[0].name === 'null null'
      ) {
        return 'Not Disclosed'
      }
      return this.widgetData.content.creatorContacts[0].name
    }
    return ''
  }

  get imageIcon(): string[] {
    if (this.widgetData.content.contentType === NsContent.EContentTypes.KNOWLEDGE_ARTIFACT) {
      return ['class', 'Knowledge Artifact']
    }
    if (this.widgetData.content.contentType !== NsContent.EContentTypes.RESOURCE) {
      return ['folder', 'Course']
    }
    switch (this.widgetData.content.mimeType) {
      case NsContent.EMimeTypes.HTML:
        return ['library_add', this.widgetData.content.resourceType]
      // tslint:disable-next-line: max-line-length
      case NsContent.EMimeTypes.MP3:
      case NsContent.EMimeTypes.MP4:
      case NsContent.EMimeTypes.M4A:
      case NsContent.EMimeTypes.M3U8:
      case NsContent.EMimeTypes.PLAYLIST:
      case NsContent.EMimeTypes.YOUTUBE:
        return ['library_music', this.widgetData.content.resourceType]
      case NsContent.EMimeTypes.PDF:
        return ['picture_as_pdf', this.widgetData.content.resourceType]
      // tslint:disable-next-line: max-line-length
      case NsContent.EMimeTypes.QUIZ:
      case NsContent.EMimeTypes.HANDS_ON:
      case NsContent.EMimeTypes.RDBMS_HANDS_ON:
      case NsContent.EMimeTypes.IAP:
      case NsContent.EMimeTypes.CERTIFICATION:
        return ['assignment_ind', this.widgetData.content.resourceType]
      default:
        return ['description', this.widgetData.content.resourceType]
    }
  }

  private modifySensibleContentRating() {
    if (this.widgetData.content)
    if(this.widgetData.content.averageRating &&
      typeof this.widgetData.content.averageRating !== 'number'){
      // tslint:disable-next-line: ter-computed-property-spacing
      this.widgetData.content.averageRating = (this.widgetData.content.averageRating as any)[
        this.configSvc.rootOrg || ''
        // tslint:disable-next-line: ter-computed-property-spacing
      ]
      this.widgetData.content.averageRating = this.widgetData.content.averageRating || 0
    }
  }

  // private assignThumbnail() {
  //   const thumbnailElement = document.getElementById(`card_${this.widgetData.content.identifier}`) as HTMLImageElement
  //   if (thumbnailElement) {
  //     try {
  //       const observer = new IntersectionObserver(
  //         entries => {
  //           entries.forEach(entry => {
  //             const { isIntersecting } = entry
  //             if (isIntersecting) {
  //               thumbnailElement.src = this.widgetData.content.appIcon
  //               observer.disconnect()
  //             }
  //           })
  //         },
  //       )
  //       observer.observe(thumbnailElement)
  //     } catch (e) {
  //       thumbnailElement.src = this.widgetData.content.appIcon
  //     }
  //   }
  // }

  get isKnowledgeBoard() {
    return (
      (this.widgetData.content && this.widgetData.content.contentType) ===
      NsContent.EContentTypes.KNOWLEDGE_BOARD
    )
  }

  raiseTelemetry() {
    // if(this.forPreview){
    //   return
    // }
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

  get isGreyedImage() {
    if (
      (this.widgetData.content && this.widgetData.content.status === 'Deleted') ||
      this.widgetData.content.status === 'Expired'
    ) {
      return true
    }
    return false
  }

  convertToISODate(date = ''): Date {
    try {
      return new Date(
        `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)}${date.substring(
          8,
          11,
        )}:${date.substring(11, 13)}:${date.substring(13, 15)}.000Z`,
      )
    } catch (ex) {
      return new Date(new Date().setMonth(new Date().getMonth() - 1))
    }
  }

  isLatest(addedOn: Date) {
    if (addedOn) {
      const dateOffset = 24 * 60 * 60 * 1000 * 7
      const last7Day = new Date()
      last7Day.setTime(last7Day.getTime() - dateOffset)
      if (addedOn.getTime() >= last7Day.getTime()) {
        return true
      }
    }
    return false
  }

  get showIntranetContent() {
    if (this.widgetData.content.isInIntranet && this.utilitySvc.isMobile) {
      return !this.isIntranetAllowedSettings
    }
    return false
  }

  showSnackbar() {
    if (this.showIntranetContent) {
      this.snackBar.open('Content is only available in intranet', 'X', { duration: 2000 })
    } else if (!this.isLiveOrMarkForDeletion) {
      this.snackBar.open('Content may be expired or deleted', 'X', { duration: 2000 })
    }
  }

  get isLiveOrMarkForDeletion() {
    if (
      !this.widgetData.content.status ||
      this.widgetData.content.status === 'Live' ||
      this.widgetData.content.status === 'MarkedForDeletion'
    ) {
      return true
    }
    return false
  }

  openComment() { }
  downloadCertificate(certificateData: any) {
    this.events.raiseInteractTelemetry(
      {
        type: WsEvents.EnumInteractTypes.CLICK,
        id: 'view-certificate',
        subType: WsEvents.EnumInteractSubTypes.CERTIFICATE,
      },
      {
        id: certificateData.issuedCertificates[0].identifier,   // id of the certificate
        type: WsEvents.EnumInteractSubTypes.CERTIFICATE,
      })
    if(certificateData && certificateData.issuedCertificates && certificateData.issuedCertificates.length && certificateData.issuedCertificates.length > 0) {
      this.downloadCertificateLoading = true
      let certData: any = certificateData.issuedCertificates
      certData.sort((a: any, b: any) => new Date(b.lastIssuedOn).getTime() - new Date(a.lastIssuedOn).getTime())
      this.certificateService.downloadCertificate_v2(certData[0].identifier).subscribe((res: any)=>{
        this.downloadCertificateLoading = false
        const cet = res.result.printUri
        this.dialog.open(CertificateDialogComponent, {
          width: '1300px',
          data: { cet, certId: certData.identifier },
        })
      })
    } else {
      this.downloadCertificateLoading = false
    }
  }

  translateLabels(label: string, type: any, subtype: any) {
    return this.langtranslations.translateLabelWithoutspace(label, type, subtype)
  }

  translateLabel(label: string, type: any) {
    return this.langtranslations.translateLabel(label, type, '')
  }

  getCbPlanData() {
    let cbpList: any={}
    if (localStorage.getItem('cbpData')) {
      let cbpListArr = JSON.parse(localStorage.getItem('cbpData') || '')
      if (cbpListArr && cbpListArr.length) {
        cbpListArr.forEach((data: any) => {
          cbpList[data.identifier] = data
        })
      }
      this.cbPlanMapData = cbpList
      // this.karmaPointLoading = false
      clearInterval(this.cbPlanInterval)
    }
  }
  async getRedirectUrlData(content: any,contentType?:any){
    const contentCategory = content && content.primaryCategory ? content.primaryCategory : 'Content'
    if(contentType) {
      this.router.navigate([`/app/gyaan-karmayogi/player/${VIEWER_ROUTE_FROM_MIME(content.mimeType)}/${content.identifier}`],{
        queryParams : {
          primaryCategory: this.primaryCategory.RESOURCE
          // preview: true
        }
      })
    } else {
      // if (content && content.status && content.status.toLowerCase() !== 'retired') {
        let urlData = await this.contSvc.getResourseLink(content)
        if (urlData && urlData.url ) {
          this.router.navigate(
            [urlData.url],
            {
              queryParams: urlData.queryParams
            })
        } else {
          // const contentType = urlData;
          this.snackBar.open(`This ${contentCategory} has been archived and is no longer available.`, 'X', { duration: 2000 });
        }
    }
    
  }

  get getMimeType() {
    let mimetype = this.widgetData && this.widgetData.content && this.widgetData.content.mimeType
    return VIEWER_ROUTE_FROM_MIME(mimetype)
  }
}