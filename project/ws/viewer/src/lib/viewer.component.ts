import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { NsContent, WidgetContentService } from '@sunbird-cb/collection'
import { NsWidgetResolver } from '@sunbird-cb/resolver'
import { ConfigurationsService, UtilityService, ValueService } from '@sunbird-cb/utils'
import { Subscription } from 'rxjs'
import { RootService } from '../../../../../src/app/component/root/root.service'
import { TStatus, ViewerDataService } from './viewer-data.service'
import { WidgetUserService } from '@sunbird-cb/collection/src/lib/_services/widget-user.service copy'
import { MobileAppsService } from '../../../../../src/app/services/mobile-apps.service'
import { ViewerHeaderSideBarToggleService } from './viewer-header-side-bar-toggle.service'
import { PdfScormDataService } from './pdf-scorm-data-service'
import { TranslateService } from '@ngx-translate/core'
import { AppTocService } from '@ws/app/src/lib/routes/app-toc/services/app-toc.service'

export enum ErrorType {
  accessForbidden = 'accessForbidden',
  notFound = 'notFound',
  internalServer = 'internalServer',
  serviceUnavailable = 'serviceUnavailable',
  somethingWrong = 'somethingWrong',
  mimeTypeMismatch = 'mimeTypeMismatch',
  previewUnAuthorised = 'previewUnAuthorised',
}

@Component({
  selector: 'viewer-container',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
})
export class ViewerComponent implements OnInit, OnDestroy, AfterViewChecked {
  fullScreenContainer: HTMLElement | null = null
  content: NsContent.IContent | null = null
  errorType = ErrorType
  show = true
  private isLtMedium$ = this.valueSvc.isLtMedium$
  sideNavBarOpened = false
  mode: 'over' | 'side' = 'side'
  forPreview = window.location.href.includes('/public/') || window.location.href.includes('&preview=true')
  isTypeOfCollection = true
  collectionId = this.activatedRoute.snapshot.queryParamMap.get('collectionId')
  batchId = this.activatedRoute.snapshot.queryParamMap.get('batchId')
  status: TStatus = 'none'
  error: any | null = null
  isNotEmbed = true
  errorWidgetData: NsWidgetResolver.IRenderConfigWithTypedData<any> = {
    widgetType: 'errorResolver',
    widgetSubType: 'errorResolver',
    widgetData: {
      errorType: '',
    },
  }
  private screenSizeSubscription: Subscription | null = null
  private resourceChangeSubscription: Subscription | null = null
  leafNodesCount: any
  viewerHeaderSideBarToggleFlag = true
  isMobile = false
  contentMIMEType = ''
  handleBackFromPdfScormFullScreenFlag = false
  enrollmentList: any
  hierarchyData: any
  enrolledCourseData: any
  batchData: any
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private valueSvc: ValueService,
    private dataSvc: ViewerDataService,
    private rootSvc: RootService,
    private utilitySvc: UtilityService,
    private changeDetector: ChangeDetectorRef,
    private widgetServ: WidgetContentService,
    private configSvc: ConfigurationsService,
    private userSvc: WidgetUserService,
    private abc: MobileAppsService,
    public viewerHeaderSideBarToggleService: ViewerHeaderSideBarToggleService,
    public pdfScormDataService: PdfScormDataService,
    private translate: TranslateService,
    private tocSvc: AppTocService
  ) {
    this.rootSvc.showNavbarDisplay$.next(false)
    this.abc.mobileTopHeaderVisibilityStatus.next(false)

    if (window.innerWidth <= 1200) {
      this.isMobile = true
    } else {
      this.isMobile = false
    }
    this.rootSvc.showNavbarDisplay$.next(false)
    this.abc.mobileTopHeaderVisibilityStatus.next(false)
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      let lang = JSON.stringify(localStorage.getItem('websiteLanguage'))
      lang = lang.replace(/\"/g, '')
      this.translate.use(lang)
    }
  }

  getContentData(e: any) {
    e.activatedRoute.data.subscribe((data: { content: { data: NsContent.IContent } }) => {
      if (data.content && data.content.data) {
        this.content = data.content.data
        this.contentMIMEType = data.content.data.mimeType
        console.log('this.content',this.content)
      }
    })
  }
  getAuthDataIdentifer() {
    const collectionId = this.activatedRoute.snapshot.queryParams.collectionId
    this.widgetServ.fetchAuthoringContent(collectionId).subscribe((data: any) => {
      if (data.result.content.cstoken) {
        this.configSvc.cstoken = data.result.content.cstoken
      }
      this.leafNodesCount = data.result.content.leafNodesCount
    })
  }

  ngOnInit() {
    const contentData = this.activatedRoute.snapshot.data.hierarchyData
    && this.activatedRoute.snapshot.data.hierarchyData.data || ''
    this.enrollmentList = this.activatedRoute.snapshot.data.enrollmentData
    && this.activatedRoute.snapshot.data.enrollmentData.data || ''
    // const contentRead = this.activatedRoute.snapshot.data.contentRead
    && this.activatedRoute.snapshot.data.contentRead.data || ''
    // if (contentRead.result && contentRead.result.content) {
    //   this.contentSvc.currentContentReadMetaData = contentRead.result.content
    // }
    if (contentData && contentData.result && contentData.result.content) {
      this.hierarchyData = contentData.result.content
      this.manipulateHierarchyData()
    }
    if (this.collectionId && this.enrollmentList) {
      const enrolledCourseData = this.widgetServ.getEnrolledData(this.collectionId)
      this.enrolledCourseData = enrolledCourseData
      this.batchData = {
        content: [enrolledCourseData.batch],
        enrolled: true,
      }
    }
    this.pdfScormDataService.handleBackFromPdfScormFullScreen.subscribe((data: any) => {
      this.handleBackFromPdfScormFullScreenFlag = data
    })

    this.viewerHeaderSideBarToggleService.visibilityStatus.subscribe((data: any) => {
      if (data) {
        if (this.isMobile) {
          this.sideNavBarOpened = false
          this.viewerHeaderSideBarToggleFlag = data
        } else {
          this.sideNavBarOpened = true
          this.viewerHeaderSideBarToggleFlag = data
        }

      } else {
        this.sideNavBarOpened = false
        this.viewerHeaderSideBarToggleFlag = data
      }

    })
    this.getAuthDataIdentifer()
    // this.getEnrollmentList()
    this.isNotEmbed = !(
      window.location.href.includes('/embed/') ||
      this.activatedRoute.snapshot.queryParams.embed === 'true'
    )
    this.isTypeOfCollection = this.activatedRoute.snapshot.queryParams.collectionType ? true : false
    this.screenSizeSubscription = this.isLtMedium$.subscribe(isSmall => {
      // this.sideNavBarOpened = !isSmall
      this.sideNavBarOpened = isSmall ? false : true
      this.mode = isSmall ? 'over' : 'side'
    })
    this.resourceChangeSubscription = this.dataSvc.changedSubject.subscribe(_ => {
      this.status = this.dataSvc.status
      this.error = this.dataSvc.error
      if (this.error && this.error.status) {
        switch (this.error.status) {
          case 403: {
            this.errorWidgetData.widgetData.errorType = ErrorType.accessForbidden
            break
          }
          case 404: {
            this.errorWidgetData.widgetData.errorType = ErrorType.notFound
            break
          }
          case 500: {
            this.errorWidgetData.widgetData.errorType = ErrorType.internalServer
            break
          }
          case 503: {
            this.errorWidgetData.widgetData.errorType = ErrorType.serviceUnavailable
            break
          }
          default: {
            this.errorWidgetData.widgetData.errorType = ErrorType.somethingWrong
            break
          }
        }
      }
      if (this.error && this.error.errorType === this.errorType.mimeTypeMismatch) {
        setTimeout(() => {
          this.router.navigate([this.error.probableUrl])
          // tslint:disable-next-line: align
        }, 3000)
      }
      if (this.error && this.error.errorType === this.errorType.previewUnAuthorised) {
      }
    })
  }

  ngAfterViewChecked() {
    const container = document.getElementById('fullScreenContainer')
    if (container) {
      this.fullScreenContainer = container
      this.changeDetector.detectChanges()
    } else {
      this.fullScreenContainer = null
      this.changeDetector.detectChanges()
    }
  }

  ngOnDestroy() {
    this.rootSvc.showNavbarDisplay$.next(true)
    if (this.screenSizeSubscription) {
      this.screenSizeSubscription.unsubscribe()
    }
    if (this.resourceChangeSubscription) {
      this.resourceChangeSubscription.unsubscribe()
    }
  }

  toggleSideBar() {
    this.sideNavBarOpened = !this.sideNavBarOpened
  }

  getEnrollmentList() {
    let userId
    if (this.configSvc.userProfile) {
      userId = this.configSvc.userProfile.userId || ''
    }
    this.userSvc.fetchUserBatchList(userId).subscribe(
      (result: any) => {
        const courses: NsContent.ICourse[] = result && result.courses
        this.widgetServ.currentBatchEnrollmentList = courses
      })
  }

  minimizeBar() {
    if (this.utilitySvc.isMobile) {
      this.sideNavBarOpened = false
    }
  }
  get isPreview(): boolean {
    this.forPreview = window.location.href.includes('/public/') || window.location.href.includes('&preview=true')
    return this.forPreview
  }

  manipulateHierarchyData() {
    this.tocSvc.mapCompletionPercentageProgram(this.hierarchyData, this.enrollmentList.courses)
  }
}
