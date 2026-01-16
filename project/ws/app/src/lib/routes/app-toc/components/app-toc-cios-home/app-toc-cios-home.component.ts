import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { CommonMethodsService } from '@sunbird-cb/consumption'
import { ConfigurationsService, EventService, MultilingualTranslationsService, WidgetContentService, WsEvents } from '@sunbird-cb/utils-v2'
import { LoaderService } from '@ws/author/src/public-api'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { CertificateService } from '../../../certificate/services/certificate.service'
import { NsDiscussionV2 } from '@sunbird-cb/discussion-v2'
import * as _ from 'lodash'
import { NetCoreService } from '../../../../../../../../../src/app/services/netcore.service'
import { ConsentDialogComponent } from './consent-dialog.component'
import { environment } from '../../../../../../../../../src/environments/environment'

@Component({
  selector: 'ws-app-app-toc-cios-home',
  templateUrl: './app-toc-cios-home.component.html',
  styleUrls: ['./app-toc-cios-home.component.scss'],
})
export class AppTocCiosHomeComponent implements OnInit, AfterViewInit {
  commentId?: string = ''
  skeletonLoader = true
  extContentReadData: any = {}
  userExtCourseEnroll: any = {}
  downloadCertificateLoading = false
  forPreview: any = window.location.href.includes('/public/') || window.location.href.includes('?editMode=true')
  extContentAvailable = true
  canEnroll = false
  enrollValidationLoading = true
  rcElem = {
    offSetTop: 0,
    BottomPos: 0,
  }
  contentLink: any = ''
  @ViewChild('rightContainer') rcElement!: ElementRef
  scrollLimit: any
  scrolled: boolean | undefined
  isMobile = false
  config: any
  widgetData: any
  enableShare = false
  rootOrgId: any
  currentLang: any = 'en'
  discussWidgetData!: NsDiscussionV2.ICommentWidgetData

  @HostListener('window:scroll', ['$event'])
  handleScroll() {

    if (this.scrollLimit) {
      if ((window.scrollY + this.rcElem.BottomPos) >= this.scrollLimit) {
        this.rcElement.nativeElement.style.position = 'sticky'
      } else {
        this.rcElement.nativeElement.style.position = 'fixed'
      }
    }

    // 236... (OffsetTop of right container + 104)
    if (window.scrollY > (this.rcElem.offSetTop + 104)) {
      this.scrolled = true
    } else {
      this.scrolled = false
    }
  }
  constructor(private route: ActivatedRoute,
    private commonSvc: CommonMethodsService,
    private translate: TranslateService,
    private configSvc: ConfigurationsService,
    private events: EventService,
    private langtranslations: MultilingualTranslationsService,
    private contentSvc: WidgetContentService,
    private certSvc: CertificateService,
    public loader: LoaderService,
    private matDialog: MatDialog,
    public snackBar: MatSnackBar,
    public netCoreService: NetCoreService
  ) {
    this.route.data.subscribe((data: any) => {
      this.enrollValidationLoading = false
      if (data && data.extContent && data.extContent.data && data.extContent.data.content) {
        this.extContentReadData = data.extContent.data.content
        this.extContentReadData['certificateObj'] = {
          data: {},
        }
        this.skeletonLoader = false

      } else {
        this.extContentAvailable = false
        this.skeletonLoader = false
      }

      if (data && data.userEnrollContent && data.userEnrollContent.data && data.userEnrollContent.data.result &&
        Object.keys(data.userEnrollContent.data.result).length > 0
      ) {
        this.userExtCourseEnroll = data.userEnrollContent.data.result
        if (this.userExtCourseEnroll.completionpercentage === 100) {
          this.extContentReadData['completionStatus'] = 2

          this.downloadCert()
          this.contentViewEventForNetCore('completion')
        }
      } else {
        this.validateEnrollmentEligibility()
      }

    })

    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      this.currentLang = localStorage.getItem('websiteLanguage')!
      this.translate.use(this.currentLang)
    }
    this.configSvc.languageTranslationFlag.subscribe((data: any) => {
      if (data) {
        if (localStorage.getItem('websiteLanguage')) {
          this.currentLang = localStorage.getItem('websiteLanguage')!
          this.translate.use(this.currentLang)
        }
      }
    })

    if (this.configSvc.userProfile) {
      this.rootOrgId = this.configSvc.userProfile.rootOrgId
    }
    this.contentLink = `${window.location.pathname.substring(1)}${window.location.search}`

    this.commentId = this.route.snapshot.queryParams.commentId ? this.route.snapshot.queryParams.commentId : ''
    if (this.commentId) {
      //this.selectedTabIndex = 2
    }
  }

  ngOnInit() {
    if (this.route.snapshot.data.pageData && this.route.snapshot.data.pageData.data) {
      this.config = this.route.snapshot.data.pageData.data
      this.initializeDiscussData()
    }
    if (window.innerWidth <= 1200) {
      this.isMobile = true
    } else {
      this.isMobile = false
    }
    this.contentViewEventForNetCore('view')
  }

  initializeDiscussData() {
    if (this.config && this.config.discussWidgetData) {
      this.discussWidgetData = this.config.discussWidgetData
      if (this.extContentReadData && this.extContentReadData.contentId) {
        this.discussWidgetData.newCommentSection.commentTreeData.entityId = this.extContentReadData.contentId
        if (this.discussWidgetData.commentsList.repliesSection && this.discussWidgetData.commentsList.repliesSection.newCommentReply) {
          this.discussWidgetData.commentsList.repliesSection.newCommentReply.commentTreeData.entityId = this.extContentReadData.contentId
        }
      }
      this.widgetData = this.config
      this.widgetData['type'] = 'tips'
      this.widgetData['cardClass'] = 'slider-container'
      this.widgetData['height'] = 'auto'
      this.widgetData['sliderData'] = _.get(this.extContentReadData, 'contentPartner.providerTips', [])

      if (Object.keys(this.userExtCourseEnroll).length) {
        this.discussWidgetData.enrolledContent = true
        this.discussWidgetData.newCommentSection.commentBox.placeholder = 'Start a discussion'
      } else {
        this.discussWidgetData.enrolledContent = false
        this.discussWidgetData.newCommentSection.commentBox.placeholder = 'Enrol to add your comments'
      }
      this.discussWidgetData = { ...this.discussWidgetData }
    }
  }

  handleCapitalize(str: string, type?: string): string {
    return this.commonSvc.handleCapitalize(str, type)
  }

  translateLabels(label: string, type: any) {
    return this.langtranslations.translateLabel(label, type, '')
  }

  ngAfterViewInit() {
    if (this.rcElement) {
      this.rcElem.BottomPos = this.rcElement.nativeElement.offsetTop + this.rcElement.nativeElement.offsetHeight
      this.rcElem.offSetTop = this.rcElement.nativeElement.offsetTop
    }
  }
  redirectToContent(contentData: any) {
    const userData: any = this.configSvc.userProfileV2
    const extUrl: string = contentData.redirectUrl.replace('<username>', userData.email)
    return extUrl
  }
  replaceText(str: any, replaceTxt: any) {
    return str.replaceAll(replaceTxt, '')
  }

  formatcourseProviders(providers: any[]): string {
    if (!providers || !Array.isArray(providers)) {
      return ''
    }
    return providers.map((provider: any) => provider.name).join(', ')
  }

  async enRollToExtCourse(content: any) {
    const consentUrl: string = `${environment?.missionKarmayogiPath}${this.config?.contentConsent?.consentDocUrl}` || ''
    const assetsDocUrl: string = `${this.config?.contentConsent?.assetsDocUrl}` || ''
    const dialogRef = this.matDialog.open(ConsentDialogComponent, {
      width: '900px',
      height: '70vh',
      maxHeight: '90vh',
      minHeight: '400px',
      disableClose: true,
      hasBackdrop: true,
      panelClass: 'consent-dialog-panel',
      data: {
        consentUrl: consentUrl,
        assetsDocUrl: assetsDocUrl
      }
    })

    // Handle dialog close
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        // User agreed - proceed with enrollment
        // need to call consent api
        this.callConsentApi(content)
      } else {
        // User disagreed
        this.snackBar.open('You must agree to the terms to enroll in this course.', 'X', {
          duration: 5000,
        })
      }
    })
  }

  callConsentApi(content: any) {
    console.log(content)
    const request = {
      "request": {
        "contentId": content?.contentId,
        "consentId": this.config?.contentConsent?.consentId || '',
        "additionalAttributes": {
          "userRoles": ["public"],
          "versionKey": new Date().getTime(),
          "description": "I have read and agree with the above declaration."
        }
      }
    }

    this.certSvc.consentSubmit(request).subscribe((_res: any) => {
      this.proceedWithEnrollment(content)
    }, (error: any) => {
      this.snackBar.open(error?.error?.params?.msg || 'Unable to submit consent', 'X', {
        duration: 5000,
      })
    })
  }
  private async proceedWithEnrollment(content: any) {
    this.loader.changeLoad.next(true)
    const reqbody = {
      courseId: content.contentId,
      partnerId: content.contentPartner.id,
    }
    const enrollRes = await this.contentSvc.extContentEnroll(reqbody).toPromise().catch(_error => { return _error })
    if (enrollRes && enrollRes.result && Object.keys(enrollRes.result).length > 0) {
      this.discussWidgetData.enrolledContent = true
      this.discussWidgetData.newCommentSection.commentBox.placeholder = 'Start a discussion'
      this.getUserContentEnroll(content.contentId)
      this.contentViewEventForNetCore('enroll')
    } else {
      this.loader.changeLoad.next(false)
      this.snackBar.open(enrollRes?.error?.params?.msg || 'Unable to enroll to the content', 'X', {
        duration: 10000,
      })
    }
  }

  async getUserContentEnroll(contentId: any) {
    const enrollRes = await this.contentSvc.fetchExtUserContentEnroll(contentId).toPromise().catch(_error => { })
    if (enrollRes && enrollRes.result && Object.keys(enrollRes.result).length > 0) {
      this.userExtCourseEnroll = enrollRes.result
      this.loader.changeLoad.next(false)
      this.telemetryToCaptureInteract(contentId, 'enroll', 'enrol-content')
      this.snackBar.open('Successfully enrolled in the course.')
    } else {
      this.loader.changeLoad.next(false)
      this.snackBar.open('Unable to get the enrolled details')
    }
  }

  captureRedirectTelemetry(content: any) {
    this.raiseTelemtryStartEvent()
    this.telemetryToCaptureInteract(content.contentId, 'redirect', 'redirect-content')
    this.raiseTelemtryEndEvent()
  }

  raiseTelemtryStartEvent() {
    const event = {
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      from: 'test',
      to: '',
      data: {
        edata: { type: '' },
        object: {},
        state: WsEvents.EnumTelemetrySubType.Loaded,
        type: 'session',
        mode: 'view',
      },
    }
    this.events.dispatchEvent(event)

  }

  telemetryToCaptureInteract(contentId: any, subType: any, id: any) {
    this.events.raiseInteractTelemetry(
      {
        type: 'click',
        subType,
        id: id,
      },
      {
        id: contentId,
        type: 'External content',
      },
      {
        module: 'Home',
      }
    )
  }

  raiseTelemtryEndEvent() {
    const event = {
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      from: 'test',
      to: '',
      data: {
        edata: { type: '' },
        object: {},
        state: WsEvents.EnumTelemetrySubType.Unloaded,
        type: 'session',
        mode: 'view',
      },
    }
    this.events.dispatchEvent(event)
  }

  async downloadCert() {
    this.downloadCertificateLoading = true
    const certRes: any = await
      this.certSvc.downloadCertificate_v2(this.userExtCourseEnroll.issued_certificates[0].identifier).toPromise().catch(_error => { })
    if (certRes && Object.keys(certRes.result).length > 0) {
      this.downloadCertificateLoading = false
      if (this.userExtCourseEnroll.issued_certificates && this.userExtCourseEnroll.issued_certificates.length
        && this.userExtCourseEnroll.issued_certificates[0]) {
        this.extContentReadData['certificateObj'] = {
          data: this.userExtCourseEnroll.issued_certificates[0],
          certData: certRes.result.printUri,
          certId: this.userExtCourseEnroll.issued_certificates[0].identifier,
        }
      }
    } else {
      this.downloadCertificateLoading = false
    }
  }
  onClickOfShare() {
    this.enableShare = true
    //this.raiseTelemetryForShare('shareContent')
  }

  /* tslint:disable */
  // raiseTelemetryForShare(subType: any) {
  //   //console.log(this.extContentReadData, this.events, subType)
  //   // this.events.raiseInteractTelemetry(
  //   // {
  //   //   type: 'click',
  //   //   subType,
  //   //   id: this.content ? this.content.identifier : '',
  //   // },
  //   // {
  //   //   id: this.content ? this.content.identifier : '',
  //   //   type: this.content ? this.content.primaryCategory : '',
  //   // },
  //   // {
  //   //   pageIdExt: `btn-${subType}`,
  //   //   module: WsEvents.EnumTelemetrymodules.CONTENT,
  //   // }
  //   // )
  // }

  resetEnableShare(_eventData: any) {

    this.enableShare = false
  }

  contentViewEventForNetCore(eventType: any) {
    if (this.configSvc.netcoreConfig && this.configSvc.netcoreConfig.netcoreWebConfig  // NOSONAR
      && this.configSvc.netcoreConfig.netcoreWebConfig.isActive // NOSONAR
      && this.configSvc.netcoreConfig.netcoreWebConfig.events // NOSONAR
      && this.configSvc.netcoreConfig.netcoreWebConfig.events.content_view // NOSONAR
      && this.configSvc.netcoreConfig.netcoreWebConfig.events.content_view.isActive // NOSONAR
    ) {
      let payload: any = {}
      // if (this.configSvc && this.configSvc.unMappedUser && this.configSvc.unMappedUser.identifier) { // NOSONAR
      //   payload['pk^userid'] = this.configSvc.unMappedUser.identifier.trim().toLowerCase()
      // }
      // console.log('payload', payload)
      if (this.extContentReadData && this.extContentReadData.name) {
        payload['content_name'] = this.extContentReadData.name
      }
      // if(this.extContentReadData && this.extContentReadData.courseCategory) {
      payload['content_category'] = 'External Course'
      // }
      if (this.extContentReadData && this.extContentReadData.externalId) {
        payload['content_id'] = this.extContentReadData.externalId
      }
      // if(this.extContentReadData && this.extContentReadData.name) {
      payload['content_url'] = window.location.href
      // }
      if (this.extContentReadData && this.extContentReadData.appIcon) {
        payload['content_image'] = this.extContentReadData.appIcon
      }
      if (this.extContentReadData && this.extContentReadData.duration) {
        payload['content_duration'] = this.extContentReadData.duration && Number(this.extContentReadData.duration) > 0 ? Number(this.extContentReadData.duration) : 0
      } else {
        payload['content_duration'] = 0
      }
      if (this.extContentReadData && this.extContentReadData.avgRating
      ) {
        payload['content_rating'] = this.extContentReadData.avgRating
        payload['content rating'] = this.extContentReadData.avgRating
      }
      if (this.extContentReadData && this.extContentReadData.totalNoOfRating) {
        payload['no_users_rated'] = this.extContentReadData.totalNoOfRating
      }
      // if(Object.keys(this.userExtCourseEnroll).length) {
      payload['learning_path_content'] = Object.keys(this.userExtCourseEnroll).length ? true : false
      payload['learning path content'] = Object.keys(this.userExtCourseEnroll).length ? true : false
      // }
      if (this.extContentReadData && this.extContentReadData.source) {
        payload['content_provider_name'] = this.extContentReadData.source
      } else if (this.extContentReadData && this.extContentReadData.contentPartner &&
        this.extContentReadData.contentPartner.contentPartnerName
      ) {
        payload['content_provider_name'] = this.extContentReadData.contentPartner.contentPartnerName
      } else {
        payload['content_provider_name'] = 'Karmayogi Bharat'
      }
      if (eventType === 'view') {
        this.netCoreService.trackEventForContentAndEvent('content_view', this.configSvc.unMappedUser.identifier.trim().toLowerCase(), payload)
      } else if (eventType === 'enroll') {
        this.netCoreService.trackEventForContentAndEvent('content_enrolment', this.configSvc.unMappedUser.identifier.trim().toLowerCase(), payload)
      } else if (eventType === 'completion') {
        this.netCoreService.trackEventForContentAndEvent('content_completion', this.configSvc.unMappedUser.identifier.trim().toLowerCase(), payload)
      }

    }
  }

  secondsToTime(d: any) {
    d = Number(d)
    var h = Math.floor(d / 3600)
    var m = Math.floor(d % 3600 / 60)
    var s = Math.floor(d % 3600 % 60)

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : ""
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : ""
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : ""
    return hDisplay + mDisplay + sDisplay
  }

  clearCommentIdFromUrl(): void {
    const currentQueryParams = { ...this.route.snapshot.queryParams }
    delete currentQueryParams.commentId
    this.commentId = ''
  }

  private validateEnrollmentEligibility(): void {
    // Only validate if user is not already enrolled and content is available
    if (Object.keys(this.userExtCourseEnroll).length === 0 && this.extContentReadData && this.extContentReadData.contentId && this.extContentReadData.contentPartner && this.extContentReadData.contentPartner.id) {
      this.enrollValidationLoading = true
      this.certSvc.validateEnrollmentEligibility(this.extContentReadData.contentId, this.extContentReadData.contentPartner.id).subscribe(
        (_response: any) => {
          this.enrollValidationLoading = false
          this.canEnroll = true
        },
        (error: any) => {
          this.snackBar.open(error?.error?.params?.msg || 'Unable to validate enrollment eligibility', 'X', {
            duration: 10000,
          })
          this.enrollValidationLoading = false
          this.canEnroll = false
        }
      )
    }
  }

}
