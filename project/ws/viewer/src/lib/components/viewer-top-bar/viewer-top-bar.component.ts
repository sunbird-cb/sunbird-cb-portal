import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'
import { ActivatedRoute, NavigationEnd, NavigationExtras, Router } from '@angular/router'
import { WidgetContentService } from '@sunbird-cb/collection/src/lib/_services/widget-content.service'
import { NsContent } from '@sunbird-cb/collection'
import { ConfigurationsService, LoggerService, NsPage, ValueService, EventService, WsEvents, DomainConfService } from '@sunbird-cb/utils-v2'
import { Subscription } from 'rxjs'
import { ViewerDataService } from '../../viewer-data.service'
import { ViewerUtilService } from '../../viewer-util.service'
import { CourseCompletionDialogComponent } from '../course-completion-dialog/course-completion-dialog.component'
import { ContentRatingV2DialogComponent, RatingService } from '@sunbird-cb/collection/src/public-api'
import { ViewerHeaderSideBarToggleService } from './../../viewer-header-side-bar-toggle.service'
import { ResetRatingsService } from '@ws/app/src/lib/routes/app-toc/services/reset-ratings.service'
import { WidgetContentLibService, ContentLanguageService } from '@sunbird-cb/consumption'
// import { WidgetContentService as WidgetContentServiceUtils } from '@sunbird-cb/utils-v2'

/* tslint:disable*/
import _ from 'lodash'
// import { ALLOWED_CATEGORY_FOR_DYNAMIC_GENERATION } from '../../../../../author/src/lib/constants/constant'

@Component({
  selector: 'viewer-viewer-top-bar',
  templateUrl: './viewer-top-bar.component.html',
  styleUrls: ['./viewer-top-bar.component.scss'],
})
export class ViewerTopBarComponent implements OnInit, OnDestroy, OnChanges {
  @Input() frameReference: any
  @Input() forPreview = false
  @Output() toggle = new EventEmitter()
  @Output() completedCountOutput = new EventEmitter()
  @Input() leafNodesCount: any
  @Input() content: any
  @Input() hierarchyMapData: any = {}
  @Input() contentReadData: any
  @Input() baseContentReadData: any
  private viewerDataServiceSubscription: Subscription | null = null
  private paramSubscription: Subscription | null = null
  private viewerDataServiceResourceSubscription: Subscription | null = null
  overallProgress = 0
  overallLeafNodes = 0
  completedCount = 0
  loadingOverallPRogress: boolean = false
  appIcon: SafeUrl | null = null
  isTypeOfCollection = false
  courseName = ''
  collectionType: string | null = null
  prevResourceUrl: string | null = null
  nextResourceUrl: string | null = null
  prevResourceUrlParams!: NavigationExtras
  nextResourceUrlParams!: NavigationExtras
  pageNavbar: Partial<NsPage.INavBackground> = this.configSvc.pageNavBar
  resourceId: string = (this.viewerDataSvc.resourceId as string) || ''
  resourceName: string | null = this.viewerDataSvc.resource ? this.viewerDataSvc.resource.name : ''
  resourcePrimaryCategory: string | null = this.viewerDataSvc.resource ? this.viewerDataSvc.resource.primaryCategory : ''
  contentProgressHash: any = []
  // previousResourcePrimaryCategory!: NsContent.EPrimaryCategory
  // nextResourcePrimaryCategory!: NsContent.EPrimaryCategory
  collectionId = ''
  logo = true
  isPreview = false
  forChannel = false
  currentRoute = window.location.pathname
  identifier: any
  batchId: any
  userid: any
  channelId: any
  optionalLink = false
  userRating: any
  userId: any
  currentDataFromEnrollList: any
  isMobile = false
  enableShare = false
  rootOrgId: any
  canShare = false
  primaryCategory = NsContent.EPrimaryCategory
  assessmentStart = false;
  enrollmentList: any = []
  collectionLang: any
  isPreAssessment:boolean = false
  redirectPath = '/page/home'
  // primaryCategory = NsContent.EPrimaryCategory
  contentPrimaryCategory: any

  constructor(
    private activatedRoute: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    // private logger: LoggerService,
    private configSvc: ConfigurationsService,
    private viewerDataSvc: ViewerDataService,
    private valueSvc: ValueService,
    private dialog: MatDialog,
    private router: Router,
    public widgetServ: WidgetContentService,
    private viewerSvc: ViewerUtilService,
    private ratingSvc: RatingService,
    private loggerSvc: LoggerService,
    private events: EventService,
    private assessmentStartCheckService: ViewerHeaderSideBarToggleService,
    private resetRatingsService: ResetRatingsService,
    private widgetLibSvc: WidgetContentLibService,
    private contentLangSvc: ContentLanguageService,
    // private contentSvc: WidgetContentServiceUtils,
    private domainConfSvc: DomainConfService
    
  ) {
    this.valueSvc.isXSmall$.subscribe(isXSmall => {
      this.logo = !isXSmall
    })
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url
      }
    })
  }

  ngOnInit() {
    this.enrollmentList = this.activatedRoute.snapshot.data.enrollmentData
      && this.activatedRoute.snapshot.data.enrollmentData.data || []
    
    this.contentPrimaryCategory = this.activatedRoute?.snapshot?.data?.contentRead && 
      this.activatedRoute?.snapshot?.data?.contentRead?.data?.result?.content?.primaryCategory

    // this.getAuthDataIdentifer()
    if (window.innerWidth <= 1200) {
      this.isMobile = true
    } else {
      this.isMobile = false
    }
    if (window.location.href.includes('/channel/')) {
      this.forChannel = true
    }
    this.isPreAssessment=this.activatedRoute.snapshot.queryParams.preAssessment ? true:false
    this.isTypeOfCollection =  this.activatedRoute.snapshot.queryParams.collectionType ? true : false
    this.collectionType = this.activatedRoute.snapshot.queryParams.collectionType
    this.collectionId = this.activatedRoute.snapshot.queryParams.collectionId
    this.courseName = this.activatedRoute.snapshot.queryParams.courseName
    this.channelId = this.activatedRoute.snapshot.queryParams.channelId
    if (this.configSvc.instanceConfig) {
      this.appIcon = this.domSanitizer.bypassSecurityTrustResourceUrl(
        this.domainConfSvc.getDomainAppLogo()
      )
      this.redirectPath = this.domainConfSvc.getDomainRedirectPath()
      if (this.configSvc.userProfile) {
        this.rootOrgId = this.configSvc.userProfile.rootOrgId
      }

    }
    //   this.route.data.subscribe((data: any) => {
    //     this.appIcon =
    //     this.domSanitizer.bypassSecurityTrustResourceUrl(data.configData.data.logos.app)
    //   }
    // )
    this.viewerDataSvc.isSkipBtn.subscribe((data: any) => {
      if (data !== undefined) {
        this.optionalLink = data
      } else {
        this.optionalLink = false
      }
    })

    this.viewerDataServiceSubscription = this.viewerDataSvc.tocChangeSubject.subscribe(data => {
      if (data.prevResource) {
        this.prevResourceUrl = data.prevResource.viewerUrl
        this.prevResourceUrlParams = {
          queryParams: {
            primaryCategory: data.prevResource.primaryCategory,
            collectionId: data.prevResource.collectionId,
            collectionType: data.prevResource.collectionType,
            batchId: data.prevResource.batchId,
            viewMode: data.prevResource.viewMode,
            preview: this.forPreview,
            channelId: this.channelId,
            ...(window.location.href.includes('preAssessment=true') ? { preAssessment: true } : {}),
          },
          fragment: '',
        }
        // if (data.prevResource.optionalReading && data.prevResource.primaryCategory === 'Learning Resource') {
        //   this.updateProgress(2, data.prevResource.identifier)
        // }
      } else {
        this.prevResourceUrl = null
      }
      if (data.nextResource) {
        this.nextResourceUrl = data.nextResource.viewerUrl
        this.nextResourceUrlParams = {
          queryParams: {
            primaryCategory: data.nextResource.primaryCategory,
            collectionId: data.nextResource.collectionId,
            collectionType: data.nextResource.collectionType,
            batchId: data.nextResource.batchId,
            viewMode: data.nextResource.viewMode,
            courseName: this.courseName,
            preview: this.forPreview,
            channelId: this.channelId,
            ...(window.location.href.includes('preAssessment=true') ? { preAssessment: true } : {}),
          },
          fragment: '',
        }
        // if (data.nextResource.optionalReading &&  data.nextResource.primaryCategory === 'Learning Resource') {
        //   this.updateProgress(2, data.nextResource.identifier)
        // }
      } else {
        this.nextResourceUrl = null
      }
      if (this.resourceId !== this.viewerDataSvc.resourceId) {
        this.resourceId = this.viewerDataSvc.resourceId as string
        this.resourceName = this.viewerDataSvc.resource ? this.viewerDataSvc.resource.name : ''
        this.resourcePrimaryCategory = this.viewerDataSvc.resource ? this.viewerDataSvc.resource.primaryCategory : ''
      }
    })
    if (this.paramSubscription) {
      this.paramSubscription.unsubscribe()
    }
    this.getUserRating(false)
    this.paramSubscription = this.activatedRoute.queryParamMap.subscribe(async params => {
      this.collectionId = params.get('collectionId') as string
      this.collectionType = params.get('collectionType') as string
      this.isPreview = params.get('preview') === 'true' ? true : false
      const enrollList: any = this.widgetLibSvc.getEnrolledDataFromList(this.enrollmentList.courses, this.collectionId) || '{}'
      this.currentDataFromEnrollList = enrollList
    })

    this.viewerDataServiceResourceSubscription = this.viewerDataSvc.changedSubject.subscribe(
      _data => {
        this.resourceId = this.viewerDataSvc.resourceId as string
        this.resourceName = this.viewerDataSvc.resource ? this.viewerDataSvc.resource.name : ''
        this.resourcePrimaryCategory = this.viewerDataSvc.resource ? this.viewerDataSvc.resource.primaryCategory : ''
      },
    )

    this.assessmentStartCheckService.visibilityStatus.subscribe((visibilityStatus) => {
      if (!visibilityStatus) {
        this.assessmentStart = true
      } else {
        this.assessmentStart = false
      }
    })

    if (this.currentDataFromEnrollList && this.currentDataFromEnrollList.content && ![
      NsContent.ECourseCategory.MODERATED_COURSE,
      NsContent.ECourseCategory.MODERATED_ASSESSEMENT,
      NsContent.ECourseCategory.MODERATED_PROGRAM,
      NsContent.ECourseCategory.INVITE_ONLY_PROGRAM,
    ].includes(this.currentDataFromEnrollList.content.courseCategory)) {
      this.canShare = true
      if (this.configSvc.userProfile) {
        this.rootOrgId = this.configSvc.userProfile.rootOrgId
      }
    }

  }

  ngOnChanges(props: SimpleChanges) {
    for (const prop in props) {
      if (prop === 'hierarchyMapData') {
        this.collectionLang = this.activatedRoute.snapshot.queryParams.ML ?
          this.activatedRoute.snapshot.queryParams.ML : this.contentLangSvc.getContentLanguage(this.contentReadData)
        if (_.isEmpty(props['hierarchyMapData'].currentValue)) {
          this.loadingOverallPRogress = true
        } else {
          const collectionId = this.activatedRoute.snapshot.queryParams.collectionId ?
            this.activatedRoute.snapshot.queryParams.collectionId : ''
          const MLID = this.activatedRoute.snapshot.queryParams.MLId ?
            this.activatedRoute.snapshot.queryParams.MLId : ''
          const id = MLID ? MLID: collectionId
          this.ComputeCompletedNodesAndPercent(id)
        }
      }
    }
  }

  updateProgress(status: number, resourceId: any) {
    const collectionId = this.activatedRoute.snapshot.queryParams.collectionId ?
      this.activatedRoute.snapshot.queryParams.collectionId : ''
    // const collectionId = this.activatedRoute.snapshot.params.id ?
    // this.activatedRoute.snapshot.params.id : ''
    const batchId = this.activatedRoute.snapshot.queryParams.batchId ?
      this.activatedRoute.snapshot.queryParams.batchId : ''
    const isPreAssessment = this.activatedRoute.snapshot.queryParams.preAssessment
    if (isPreAssessment) {
      return this.viewerSvc
        .realTimeProgressUpdateForPreAssessmentQuiz(resourceId, status)

    }
    return this.viewerSvc.realTimeProgressUpdateQuiz(resourceId, collectionId, batchId, status)
  }

  ComputeCompletedNodesAndPercent(identifier: string) {
    this.overallLeafNodes = this.leafNodesCount || 0
    if (this.hierarchyMapData && this.hierarchyMapData[identifier]) {
      // tslint:disable
      const completedItems = _.filter(this.hierarchyMapData[identifier].leafNodes, r => (this.hierarchyMapData[r] && (this.hierarchyMapData[r].completionStatus === 2 || this.hierarchyMapData[r].completionPercentage === 100)))
      this.completedCount = completedItems.length
      this.completedCountOutput.emit(this.completedCount)
      this.overallLeafNodes = _.toInteger(_.get(this.hierarchyMapData[identifier], 'leafNodesCount')) || 1
      // tslint:disable
      this.hierarchyMapData[identifier]['completionPercentage'] = Number(((completedItems.length / this.overallLeafNodes) * 100).toFixed())
      this.hierarchyMapData[identifier]['completionStatus'] = (this.hierarchyMapData[identifier].completionPercentage >= 100) ? 2 : 1
      this.overallProgress = this.hierarchyMapData[identifier]['completionPercentage']
    }
    this.loadingOverallPRogress = false
  }

  ngOnDestroy() {
    if (this.viewerDataServiceSubscription) {
      this.viewerDataServiceSubscription.unsubscribe()
    }
    if (this.paramSubscription) {
      this.paramSubscription.unsubscribe()
    }
    if (this.viewerDataServiceResourceSubscription) {
      this.viewerDataServiceResourceSubscription.unsubscribe()
    }
  }

  toggleSideBar() {
    this.toggle.emit()
  }
  get needToHide(): boolean {
    return this.router.url.includes('all/assessment/')
  }

  back() {
    try {
      if (window.self !== window.top) {
        return
      }
      window.history.back()
    } catch (_ex) {
      window.history.back()
    }
  }
  finishDialog() {
    let id = ''
    if (!this.forPreview) {
      this.contentProgressHash = []
      this.identifier = this.activatedRoute.snapshot.queryParams.collectionId
      this.batchId = this.activatedRoute.snapshot.queryParams.batchId

      if (this.identifier && this.batchId && this.configSvc.userProfile) {
        let userId
        if (this.configSvc.userProfile) {
          userId = this.configSvc.userProfile.userId || ''
          this.userid = this.configSvc.userProfile.userId || ''
        }
        const language = this.viewerSvc.getResourceContentLanguage(this.identifier)
        const req = {
          request: {
            userId,
            language,
            batchId: this.batchId,
            courseId: this.identifier || '',
            contentIds: [],
            fields: ['progressdetails'],
          },
        }
        this.widgetServ.fetchContentHistoryV2(req).subscribe(
          (data: any) => {

            this.contentProgressHash = data.result.contentList
            this.widgetServ.setProgramChildResumeData(this.contentProgressHash, this.identifier)
            
            if(this.contentProgressHash?.length && this.contentProgressHash[0]?.completionPercentage === 100 && this.contentProgressHash[0]?.status === 2) {
                this.generateCertificate()
            }

            if (this.leafNodesCount === this.contentProgressHash.length) {
              const ipStatusCount = this.contentProgressHash.filter((item: any) => item.status === 1)

              if (ipStatusCount.length === 0) {
                const MLID = this.activatedRoute.snapshot.queryParams.MLId ?
                  this.activatedRoute.snapshot.queryParams.MLId : ''
                // check if multilingual ID is there then hit the API with MLID
                id = MLID ? MLID : this.identifier
                const dialogRef = this.dialog.open(CourseCompletionDialogComponent, {
                  autoFocus: false,
                  data: {
                    courseName: this.activatedRoute.snapshot.queryParams.courseName,
                    userId: this.userid,
                    identifier: id,
                    primaryCategory: this.collectionType,
                    courseCategory: this.currentDataFromEnrollList.content.courseCategory
                  },
                  panelClass: 'course-completion-dialog'
                })
                dialogRef.afterClosed().subscribe(result => {
                  if (result === true) {
                    this.router.navigateByUrl(`app/toc/${this.collectionId}/overview`)
                  }
                })
              } else {
                this.router.navigateByUrl(`app/toc/${this.collectionId}/overview`)
              }
            } else {
              this.router.navigateByUrl(`app/toc/${this.collectionId}/overview`)
            }
          })
      }
    } else {
      this.router.navigateByUrl(`public/toc/${this.collectionId}/overview`)
    }
  }

  getUserRating(fireUpdate: boolean) {
    let id = ''
    if (this.configSvc.userProfile) {
      this.userId = this.configSvc.userProfile.userId || ''
    }
    if (this.collectionId && this.collectionType) {
      const MLID = this.activatedRoute.snapshot.queryParams.MLId ?
        this.activatedRoute.snapshot.queryParams.MLId : ''
      // check if multilingual ID is there then hit the API with MLID
      id = MLID ? MLID : this.collectionId
      this.ratingSvc.getRating(id, this.collectionType, this.userId).subscribe(
        (res: any) => {
          if (res && res.result && res.result.response) {
            this.userRating = res.result.response
            if (fireUpdate) {
              // this.tocSvc.changeUpdateReviews(true)
            }
          }
        },
        (err: any) => {
          this.loggerSvc.error('USER RATING FETCH ERROR >', err)
        }
      )
    }
  }

  openFeedbackDialog(contentP?: any): void {
    const MLID = this.activatedRoute.snapshot.queryParams.MLId ?
      this.activatedRoute.snapshot.queryParams.MLId : ''
    // check if multilingual ID is there then hit the API with MLID
    const id = MLID ? MLID : this.collectionId
    const contentTmp = {
      identifier: id,
      primaryCategory: this.collectionType,
    }
    const content = contentP ? contentP : contentTmp
    const dialogRef = this.dialog.open(ContentRatingV2DialogComponent, {
      // height: '400px',
      width: '770px',
      data: { content, userId: this.userId, userRating: this.userRating },
    })
    // dialogRef.componentInstance.xyz = this.configSvc
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.getUserRating(false)
        this.resetRatingsService.setRatingServiceUpdate(true)
      }
    })
  }

  onClickOfShare() {
    this.enableShare = true
    this.raiseTelemetryForShare('shareContent')
  }

  /* tslint:disable */
  raiseTelemetryForShare(subType: any) {
    this.events.raiseInteractTelemetry(
      {
        type: 'click',
        subType,
        id: this.content ? this.content.identifier : '',
      },
      {
        id: this.content ? this.content.identifier : '',
        type: this.content ? this.content.primaryCategory : '',
      },
      {
        pageIdExt: `btn-${subType}`,
        module: WsEvents.EnumTelemetrymodules.CONTENT,
      }
    )
  }

  resetEnableShare() {
    this.enableShare = false
  }

  checkRatingAndApply() {
    this.checkProgressAndGenerateCertificate();
    if (!this.userRating && this.contentCompletionPercent >= 100) {
      this.openFeedbackDialog(this.userRating)
    }
  }

  get isMultilingual() {
    if(this.baseContentReadData  && this.baseContentReadData.languageMapV1){
      let languageList = this.contentLangSvc.getAllContentLanguages(this.contentReadData)
      return languageList.length > 1
    }
    return false
  }

  get contentCompletionPercent() {
    if(this.contentReadData && this.contentReadData.primaryCategory === 'Course' && this.isMultilingual) {
      if(this.widgetServ?.languageMapProgress && this.collectionLang && 
        this.widgetServ?.languageMapProgress[this.collectionLang]) {
          return this.widgetServ?.languageMapProgress[this.collectionLang]
      } else {
        return 0
      }
    } else {
      return this.overallProgress
    }
  }

  checkProgressAndGenerateCertificate() {
    this.identifier = this.activatedRoute.snapshot.queryParams.collectionId;
    if (this.configSvc.userProfile) {
      this.userid = this.configSvc.userProfile.userId || '';
      let request: any = {
        request: {
          retiredCoursesEnabled: true,
          courseId: [this.identifier],
        },
      };

      this.widgetServ.getUserEnrollmentData(this.userId, request).subscribe({
        next: (response: any) => {
          if (response?.data && response?.data?.courses.length) {
            const course = response?.data?.courses[0];
            if (
              course?.completionPercentage >= 100 &&
              course?.status === 2 &&
              !course?.issuedCertificates?.length
            ) {
              this.generateCertificate();
            }
          }
        },
      });
    }
  }

   generateCertificate() {
      // const allowedPrimaryCategory = ALLOWED_CATEGORY_FOR_DYNAMIC_GENERATION?.map(
      //   (cat: string) => cat?.toLowerCase()
      // );

      // if (
      //   allowedPrimaryCategory &&
      //   (allowedPrimaryCategory.includes(this.contentPrimaryCategory?.toLowerCase()) ||
      //   allowedPrimaryCategory.includes(this.currentDataFromEnrollList.content.courseCategory?.toLowerCase()) )
      // ) {
      //   const payload = {
      //     request: {
      //       courseId: this.identifier,
      //       batchId: this.batchId,
      //       userId: this.userid,
      //     },
      //   };
      //   this.contentSvc.downloadCertV2(payload).subscribe(() => {});
      // } 
  }
}
