import {
  Component, OnDestroy, OnInit, AfterViewInit, AfterViewChecked,
  HostListener, ElementRef, ViewChild, ViewEncapsulation, Input,
} from '@angular/core'
import { SafeHtml, DomSanitizer, SafeStyle } from '@angular/platform-browser'
import { ActivatedRoute, Event, Data, Router, NavigationEnd } from '@angular/router'
import { FormControl, Validators } from '@angular/forms'
import { HttpErrorResponse } from '@angular/common/http'
import { MatDialog, MatSnackBar } from '@angular/material'
import { TranslateService } from '@ngx-translate/core'
import { Subscription, Observable, Subject } from 'rxjs'
import { share, takeUntil } from 'rxjs/operators'
import dayjs from 'dayjs'
// tslint:disable-next-line
import _ from 'lodash'
dayjs.extend(isSameOrBefore)
import moment from 'moment'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

import {
  NsContent, WidgetContentService,
  viewerRouteGenerator, NsPlaylist, NsGoal,
} from '@sunbird-cb/collection'
import { NsWidgetResolver } from '@sunbird-cb/resolver'
import {
  ConfigurationsService, EventService,
  LoggerService, MultilingualTranslationsService,
  NsPage, TFetchStatus, TelemetryService,
  UtilityService, WsEvents,
} from '@sunbird-cb/utils-v2'

import { WidgetUserServiceLib } from '@sunbird-cb/consumption'
import { NsAppToc } from '../../models/app-toc.model'
import { AppTocService } from '../../services/app-toc.service'
import { AccessControlService } from '@ws/author/src/public-api'
import { MobileAppsService } from 'src/app/services/mobile-apps.service'
import { HandleClaimService } from '@sunbird-cb/collection/src/lib/_common/content-toc/content-services/handle-claim.service'
import { ActionService } from '../../services/action.service'
import { RatingService } from '../../../../../../../../../library/ws-widget/collection/src/lib/_services/rating.service'
import { ViewerUtilService } from '@ws/viewer/src/lib/viewer-util.service'
import { LoadCheckService } from '../../services/load-check.service'
import { ResetRatingsService } from './../../services/reset-ratings.service'

import { AppTocDialogIntroVideoComponent } from '../app-toc-dialog-intro-video/app-toc-dialog-intro-video.component'
import { ContentRatingV2DialogComponent } from '@sunbird-cb/collection/src/lib/_common/content-rating-v2-dialog/content-rating-v2-dialog.component'
import { NsCardContent } from '@sunbird-cb/collection/src/lib/card-content-v2/card-content-v2.model'
import { environment } from 'src/environments/environment'
import { TimerService } from '../../services/timer.service'

export enum ErrorType {
  internalServer = 'internalServer',
  serviceUnavailable = 'serviceUnavailable',
  somethingWrong = 'somethingWrong',
}

const flattenItems = (items: any[], key: string | number) => {
  return items.reduce((flattenedItems, item) => {
    flattenedItems.push(item)
    if (Array.isArray(item[key])) {
      // tslint:disable-next-line
      flattenedItems = flattenedItems.concat(flattenItems(item[key], key))
    }
    return flattenedItems
    // tslint:disable-next-line
  }, [])
}
@Component({
  selector: 'ws-app-app-toc-home',
  templateUrl: './app-toc-home.component.html',
  styleUrls: ['./app-toc-home.component.scss'],
  // tslint:disable-next-line: use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
})

export class AppTocHomeComponent implements OnInit, OnDestroy, AfterViewChecked, AfterViewInit {
  show = false
  changeTab = false
  skeletonLoader = false
  banners: NsAppToc.ITocBanner | null = null
  showMoreGlance = false
  content: NsContent.IContent | null = null
  contentReadData: NsContent.IContent | null = null
  errorCode: NsAppToc.EWsTocErrorCode | null = null
  resumeData: any = null
  nsCardContentData: any = NsCardContent.ACBPConst
  batchData: NsContent.IBatchListResponse | null = null
  currentCourseBatchId: string | null = null
  userEnrollmentList!: NsContent.ICourse[]
  routeSubscription: Subscription | null = null
  pageNavbar: Partial<NsPage.INavBackground> = this.configSvc.pageNavBar
  isCohortsRestricted = false
  sticky = false
  isInIframe = false
  cbPlanEndDate: any
  cbPlanDuration: any
  enrolledCourseData: any
  @Input() forPreview: any = window.location.href.includes('/public/') || window.location.href.includes('/author/')
  // forPreview = window.location.href.includes('/author/')
  analytics = this.route.snapshot.data.pageData.data.analytics
  errorWidgetData: NsWidgetResolver.IRenderConfigWithTypedData<any> = {
    widgetType: 'errorResolver',
    widgetSubType: 'errorResolver',
    widgetData: {
      errorType: 'internalServer',
    },
  }
  isAuthor = false
  authorBtnWidget: NsPage.INavLink = {
    actionBtnId: 'feature_authoring',
    config: {
      type: 'mat-button',
    },
  }
  tocConfig: any = null
  primaryCategory = NsContent.EPrimaryCategory
  courseCategory = NsContent.ECourseCategory
  WFBlendedProgramStatus = NsContent.WFBlendedProgramStatus
  askAuthorEnabled = true
  trainingLHubEnabled = false
  trainingLHubCount$?: Observable<number>
  body: SafeHtml | null = null
  viewMoreRelatedTopics = false
  hasTocStructure = false
  tocStructure: NsAppToc.ITocStructure | null = null
  contentParents: { [key: string]: NsAppToc.IContentParentResponse[] } = {}
  objKeys = Object.keys
  fragment!: string
  activeFragment = this.route.fragment.pipe(share())
  currentFragment = 'overview'
  showScroll!: boolean
  showScrollHeight = 300
  hideScrollHeight = 10
  elementPosition: any
  batchSubscription: Subscription | null = null
  batchDataSubscription: Subscription | null = null
  resumeDataSubscription: Subscription | null = null
  @ViewChild('stickyMenu', { static: true }) menuElement!: ElementRef
  batchControl = new FormControl('', Validators.required)
  contentProgress = 0
  bannerUrl: SafeStyle | null = null
  routePath = 'overview'
  validPaths = new Set(['overview', 'contents', 'analytics'])
  routerParamSubscription: Subscription | null = null
  initialrouteData: any
  actionBtnStatus = 'wait'
  isRegistrationSupported = false
  showIntranetMessage = false
  firstResourceLink: { url: string; queryParams: { [key: string]: any } } | null = null
  resumeDataLink: { url: string; queryParams: { [key: string]: any } } | null = null
  showTakeAssessment: NsAppToc.IPostAssessment | null = null
  checkRegistrationSources: Set<string> = new Set([
    'SkillSoft Digitalization',
    'SkillSoft Leadership',
    'Pluralsight',
  ])
  btnPlaylistConfig: NsPlaylist.IBtnPlaylist | null = null
  btnGoalsConfig: NsGoal.IBtnGoal | null = null
  externalContentFetchStatus: TFetchStatus = 'done'
  registerForExternal = false
  isGoalsEnabled = false
  contextId?: string
  contextPath?: string
  defaultSLogo = ''
  disableEnrollBtn = false
  isAssessVisible = false
  isPracticeVisible = false
  certificateOpen = false
  breadcrumbs: any
  historyData: any
  courseCompleteState = 2
  userId: any
  userRating: any
  dakshtaName = environment.dakshtaName
  cscmsUrl = environment.cscmsUrl
  showBtn = false
  channelId: any
  selectedBatchData: any
  selectedBatchSubscription: any
  serverDateSubscription: any
  serverDate: any
  kparray: any = []
  enrollBtnLoading = false
  isAcbpCourse = false
  isAcbpClaim = false
  courseID: any
  isClaimed = false
  monthlyCapExceed = false
  isCompletedThisMonth = false
  startDate: any
  endDate: any
  startDateDifference: any
  endDateDifference: any
  @ViewChild('rightContainer', { static: false }) rcElement!: ElementRef
  @ViewChild('bannerDetails', { static: true }) bannerElem!: ElementRef
  @ViewChild('contentSource', { static: false }) contentSource!: ElementRef
  sourceEllipsis = false
  scrollLimit = 0
  rcElem = {
    offSetTop: 0,
    BottomPos: 0,
  }
  scrolled = false
  pathSet = new Set()
  canShare = false
  enableShare = false
  rootOrgId: any
  certId: any
  mobile1200: any
  assessmentStrip: any
  learnAdvisoryData: any
  contentCreatorData: any =  []
  // randomlearnAdvisoryObj: any
  // learnAdvisoryDataLength: any

  private destroySubject$ = new Subject<any>()
  timerUnsubscribe: any
  timer: any

  @HostListener('window:scroll', ['$event'])
  handleScroll() {
    const windowScroll = window.pageYOffset
    if (windowScroll >= this.elementPosition - 100) {
      this.sticky = true
    } else {
      this.sticky = false
    }

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contentSvc: WidgetContentService,
    private userSvc: WidgetUserServiceLib,
    public tocSvc: AppTocService,
    private loggerSvc: LoggerService,
    private configSvc: ConfigurationsService,
    private domSanitizer: DomSanitizer,
    private authAccessControlSvc: AccessControlService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private mobileAppsSvc: MobileAppsService,
    private utilitySvc: UtilityService,
    // private progressSvc: ContentProgressService,
    private actionSVC: ActionService,
    private viewerSvc: ViewerUtilService,
    private ratingSvc: RatingService,
    private telemetryService: TelemetryService,
    private translate: TranslateService,
    private langtranslations: MultilingualTranslationsService,
    private events: EventService,
    private matSnackBar: MatSnackBar,
    private loadCheckService: LoadCheckService,
    private handleClaimService: HandleClaimService,
    private resetRatingsService: ResetRatingsService,
    private timerService: TimerService,
  ) {
    this.historyData = history.state
    this.handleBreadcrumbs()
    this.mobileAppsSvc.mobileTopHeaderVisibilityStatus.next(true)
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }

    this.loadCheckService.childComponentLoaded$.subscribe(_isLoaded => {
      // Present in app-toc-about.component
      if (document.getElementById('ratingsDiv')) {
        setTimeout(() => {
          const ratingsDiv = document.getElementById('ratingsDiv') as any
          if (ratingsDiv) {
            this.scrollLimit = ratingsDiv.getBoundingClientRect().bottom as any
          }
        },         500)
      }

      if (document.getElementById('contentContainer')) {
        const contentDiv = document.getElementById('contentContainer') as any
        if (contentDiv) {
          this.scrollLimit = contentDiv.getBoundingClientRect().bottom as any
        }
      }
    })

    this.handleClaimService.getClaimData().subscribe((_eventData: any) => {
      this.onClickOfClaim(_eventData)
    })
  }

  ngOnInit() {
    this.mobile1200 = window.innerWidth < 1201
    this.configSvc.languageTranslationFlag.subscribe((data: any) => {
      if (data) {
        if (localStorage.getItem('websiteLanguage')) {
          this.translate.setDefaultLang('en')
          const lang = localStorage.getItem('websiteLanguage')!
          this.translate.use(lang)
        }
      }
    })

    if (this.route.snapshot.data.pageData && this.route.snapshot.data.pageData.data) {
      this.learnAdvisoryData = this.route.snapshot.data.pageData.data.learnerAdvisory
      // this.learnAdvisoryDataLength = this.learnAdvisoryData.length

    }

    this.getServerDateTime()
    // this.displayRandomlearnAdvisoryData()

    this.selectedBatchSubscription = this.tocSvc.getSelectedBatch.subscribe(batchData => {
      this.selectedBatchData = batchData
    })

    this.serverDateSubscription = this.tocSvc.serverDate.subscribe(serverDate => {
      this.serverDate = serverDate
    })

    this.channelId = this.telemetryService.telemetryConfig ? this.telemetryService.telemetryConfig.channel : ''
    try {
      this.isInIframe = window.self !== window.top
    } catch (_ex) {
      this.isInIframe = false
    }

    if (this.route) {
      this.skeletonLoader = true
      this.routeSubscription = this.route.data.subscribe(async (data: Data) => {
        if (data && data.content && data.content.data && data.content.data.identifier) {
          this.courseID = data.content.data.identifier
          this.skeletonLoader = false
          this.tocSvc.fetchGetContentData(data.content.data.identifier).subscribe(res => {
            this.contentReadData = res.result.content
          },                                                                      (error: HttpErrorResponse) => {
            if (!error.ok) {
              this.matSnackBar.open('Unable to fetch content data, due to some error!')
            }
          })
          const initData = this.tocSvc.initData(data, true)
          this.content = initData.content
          if (this.forPreview) {
            this.tocSvc.contentLoader.next(true)
            await this.tocSvc.fetchCourseHeirarchy(this.content)
            this.tocSvc.contentLoader.next(false)
            this.tocSvc.checkModuleWiseData(this.content)
          }
          this.initialrouteData = data
          this.banners = data.pageData.data.banners
          this.tocSvc.subtitleOnBanners = data.pageData.data.subtitleOnBanners || false
          this.tocSvc.showDescription = data.pageData.data.showDescription || false
          this.tocConfig = data.pageData.data
          this.kparray = this.tocConfig.karmaPoints
          this.tocConfig = data.pageData.data
          this.kparray = this.tocConfig.karmaPoints
          if (this.content && this.isPostAssessment) {
            this.tocSvc.fetchPostAssessmentStatus(this.content.identifier).subscribe(res => {
              const assessmentData = res.result
              for (const o of assessmentData) {
                if (o.contentId === (this.content && this.content.identifier)) {
                  this.showTakeAssessment = o
                  break
                }
              }
            })
          }
          this.initData(data)
        }
      })
    }

    this.currentFragment = 'overview'
    this.route.fragment.subscribe((fragment: string) => {
      this.currentFragment = fragment || 'overview'
    })

    this.batchSubscription = this.tocSvc.batchReplaySubject.subscribe(
      () => {
        this.fetchBatchDetails()
        if (this.content && (this.content.primaryCategory === this.primaryCategory.BLENDED_PROGRAM)) {
          this.fetchUserWFForBlended()
        }
      },
      () => {
        // tslint:disable-next-line: no-console
        console.log('error on batchSubscription')
      },
    )

    this.batchDataSubscription = this.tocSvc.setBatchDataSubject.subscribe(
      () => {
        if (this.content && (this.content.primaryCategory === this.primaryCategory.BLENDED_PROGRAM)) {
          this.fetchUserWFForBlended()
        }
      },
      () => {
        // tslint:disable-next-line: no-console
        console.log('error on batchDataSubscription')
      },
    )

    const instanceConfig = this.configSvc.instanceConfig
    if (instanceConfig && instanceConfig.logos && instanceConfig.logos.defaultSourceLogo) {
      this.defaultSLogo = instanceConfig.logos.defaultSourceLogo
    }

    if (this.configSvc.restrictedFeatures) {
      this.isGoalsEnabled = !this.configSvc.restrictedFeatures.has('goals')
    }

    this.routeSubscription = this.route.queryParamMap.subscribe(qParamsMap => {
      const contextId = qParamsMap.get('contextId')
      const contextPath = qParamsMap.get('contextPath')
      if (contextId && contextPath) {
        this.contextId = contextId
        this.contextPath = contextPath
      }
    })

    if (this.configSvc.restrictedFeatures) {
      this.isRegistrationSupported = this.configSvc.restrictedFeatures.has('registrationExternal')
      this.showIntranetMessage = !this.configSvc.restrictedFeatures.has(
        'showIntranetMessageDesktop',
      )
    }

    this.checkRegistrationStatus()
    this.routerParamSubscription = this.router.events.subscribe((routerEvent: Event) => {
      if (routerEvent instanceof NavigationEnd) {
        this.assignPathAndUpdateBanner(routerEvent.url)
      }
    })

    if (this.content) {
      const contentName = this.content.name.trim()
      if (this.content.creatorContacts) {
       this.contentCreatorData =  this.handleParseJsonData(this.content.creatorContacts)
      }
      if ((contentName).toLowerCase() === this.dakshtaName.toLowerCase()) {
        this.showBtn = true
      } else {
        this.showBtn = false
      }
      this.btnPlaylistConfig = {
        contentId: this.content.identifier,
        contentName: this.content.name,
        contentType: this.content.contentType,
        primaryCategory: this.content.primaryCategory,
        mode: 'dialog',
      }
      this.btnGoalsConfig = {
        contentId: this.content.identifier,
        contentName: this.content.name,
        contentType: this.content.contentType,
        primaryCategory: this.content.primaryCategory,
      }
    }
    if (this.content && ![
      NsContent.ECourseCategory.MODERATED_COURSE,
      NsContent.ECourseCategory.MODERATED_ASSESSEMENT,
      NsContent.ECourseCategory.MODERATED_PROGRAM,
      NsContent.ECourseCategory.INVITE_ONLY_PROGRAM,
    ].includes(this.content.courseCategory)) {
      this.canShare = true
      if (this.configSvc.userProfile) {
        this.rootOrgId = this.configSvc.userProfile.rootOrgId
      }
    }
  }

  // displayRandomlearnAdvisoryData(): void {
  //   const randomIndex = Math.floor(Math.random() * this.learnAdvisoryData.length)
  //   this.randomlearnAdvisoryObj = this.learnAdvisoryData[randomIndex]
  // }

  getKarmapointsLimit() {
    if (!this.forPreview) {
      this.contentSvc.userKarmaPoints().subscribe((res: any) => {
        if (res && res.kpList) {
          const info = res.kpList.addinfo
          if (info) {
            this.monthlyCapExceed = JSON.parse(info).claimedNonACBPCourseKarmaQuota >= 4
          }
        }
      })
    }
  }

  isCourseCompletedOnThisMonth() {
    const now = moment(this.serverDate).format('YYYY-MM-DD')
    if (this.content) {
      const courseData = this.enrolledCourseData
      if (courseData && courseData.completionPercentage === 100 && courseData.completedOn) {
        const completedOn = moment(courseData.completedOn).format('YYYY-MM-DD')
        const completedMonth = moment(completedOn, 'YYYY-MM-DD').month()
        const currentMonth = moment(now, 'YYYY-MM-DD').month()
        this.isCompletedThisMonth = completedMonth === currentMonth
        this.content['viewMore'] = false
        this.content['completedOn'] = courseData.completedOn
      }
    }
  }

  filteredAcbpList(res: any) {
    return res.filter((v: any) => v.identifier === this.courseID)
  }

  findACPB() {
    const localCbp = localStorage.getItem('cbpData')
    if (localCbp) {
      const storeageCbp = JSON.parse(localCbp)
      const cbp = this.filteredAcbpList(storeageCbp)
      if (cbp.length) {
        const acbp = 'cbPlan'
        this.cbPlanEndDate = cbp[0].endDate
        const sDate = dayjs(this.serverDate).format('YYYY-MM-DD')
        const daysCount = dayjs(this.cbPlanEndDate).diff(this.serverDate, 'day')
        this.cbPlanDuration = daysCount < 0 ? NsCardContent.ACBPConst.OVERDUE : daysCount > 29
          ? NsCardContent.ACBPConst.SUCCESS : NsCardContent.ACBPConst.UPCOMING
        if (acbp && this.cbPlanEndDate && acbp === 'cbPlan') {
          this.isAcbpCourse = true
          const eDate = dayjs(this.cbPlanEndDate).format('YYYY-MM-DD')
          if (dayjs(sDate).isSameOrBefore(eDate)) {
            const requestObj = {
              request: {
                filters: {
                  contextType: 'Course',
                  contextId: this.courseID,
                },
              },
            }
            this.contentSvc.getCourseKarmaPoints(requestObj).subscribe((res: any) => {
              if (res && res.kpList) {
                const row = res.kpList
                if (row.addinfo) {
                  if (JSON.parse(row.addinfo).ACBP) {
                    this.isAcbpClaim = false
                    this.isClaimed = true
                  } else {
                    this.isAcbpClaim = true
                  }
                } else {
                  this.isAcbpClaim = true
                }
              } else {
                this.isAcbpClaim = true
              }
            })
          }
        }
      }
    }
  }

  raiseTelemeteryForProvider(providerName: string, prividerId: string) {
    this.events.raiseInteractTelemetry(
      {
        type: 'click',
        id: 'btn-provider',
      },
      {
        id: providerName,
        type: prividerId,
      },
      {
        pageIdExt: 'btn-provider',
        module: WsEvents.EnumTelemetrymodules.CONTENT,
      })

  }

  raiseTelemetry() {
    this.events.raiseInteractTelemetry(
      {
        type: 'click',
        subType: 'karmapoints-claim',
        id: this.courseID,
      },
      {
        id: this.courseID,
        type: 'course',
      },
      {
        pageIdExt: 'btn-acbp-claim',
        module: WsEvents.EnumTelemetrymodules.KARMAPOINTS,
      })
  }

  onClickOfClaim(event: any) {
    // tslint:disable:no-console
    console.log(event)
    const request = {
      userId: this.configSvc.unMappedUser.identifier,
      courseId: this.courseID,
    }
    this.raiseTelemetry()
    this.contentSvc.claimKarmapoints(request).subscribe((res: any) => {
      // tslint:disable:no-console
      console.log(res)
      this.isClaimed = true
      this.openSnackbar('Karma points are successfully claimed.')
      this.getUserEnrollmentList()
    },                                                  (error: any) => {
      // tslint:disable:no-console
      console.log(error)
      this.openSnackbar('something went wrong.')
    })
  }

  ngAfterViewInit() {
    if (this.rcElement) {
      this.rcElem.BottomPos = this.rcElement.nativeElement.offsetTop + this.rcElement.nativeElement.offsetHeight
      this.rcElem.offSetTop = this.rcElement.nativeElement.offsetTop
    }
    // Get Time for the batch
    this.timerUnsubscribe = this.timerService.getTimerData()
    .pipe(takeUntil(this.destroySubject$))
    .subscribe((_timer: any) => {
      this.timer = _timer
    })
  }

  handleBreadcrumbs() {
    if (this.historyData) {
      if (this.historyData.path === 'Search') {
        const searchurl = `/app/globalsearch`
        const qParam = {
          q: this.historyData.param,
        }
        // tslint:disable-next-line:max-line-length
        this.breadcrumbs = { url: 'home', titles: [{ title: 'Search', url: searchurl, queryParams: qParam }, { title: 'Details', url: 'none' }] }
      } else if (this.historyData.path === 'competency-details') {
        const finalUrl = `/app/learn/browse-by/competency/${this.historyData.param}`
        // tslint:disable-next-line: max-line-length
        this.breadcrumbs = { url: 'home', titles: [{ title: this.historyData.param, url: finalUrl }, { title: 'Details', url: 'none' }] }
      } else if (this.historyData.path === 'all-CBP') {
        const finalURL = `/app/learn/browse-by/provider/${this.historyData.param}`
        this.breadcrumbs = { url: 'home', titles: [{ title: `all CBP's`, url: finalURL }, { title: 'Details', url: 'none' }] }
      } else if (this.historyData.path === 'all-competencies') {
        const finalUrl = `/app/learn/browse-by/competency/all-competencies`
        // tslint:disable-next-line: max-line-length
        this.breadcrumbs = { url: 'home', titles: [{ title: 'all competencies', url: finalUrl }, { title: 'Details', url: 'none' }] }
      } else if (this.historyData.path === 'curatedCollections') {
        const finalUrl = `/app/curatedCollections/home`
        // tslint:disable-next-line: max-line-length
        this.breadcrumbs = { url: 'home', titles: [{ title: 'curated collections', url: finalUrl }, { title: 'Details', url: 'none' }] }
      } else {
        // tslint:disable-next-line:max-line-length
        this.breadcrumbs = { url: 'home', titles: [{ title: 'Learn', url: '/page/learn', icon: 'school' }, { title: 'Details', url: 'none' }] }
      }
    }
  }

  ngAfterViewChecked(): void {
    try {
      if (this.fragment) {
        // tslint:disable-next-line: no-non-null-assertion
        document!.querySelector(`#${this.fragment}`)!.scrollTo({
          top: 80,
          behavior: 'smooth',
        })
      }
    } catch (e) { }
  }

  get enableAnalytics(): boolean {
    if (this.configSvc.restrictedFeatures) {
      return !this.configSvc.restrictedFeatures.has('tocAnalytics')
    }
    return false
  }

  get isResource() {
    if (this.content) {
      const isResource = this.content.primaryCategory === NsContent.EPrimaryCategory.KNOWLEDGE_ARTIFACT ||
        this.content.primaryCategory === NsContent.EPrimaryCategory.RESOURCE
        || this.content.primaryCategory === NsContent.EPrimaryCategory.PRACTICE_RESOURCE
        || this.content.primaryCategory === NsContent.EPrimaryCategory.FINAL_ASSESSMENT
        || this.content.primaryCategory === NsContent.EPrimaryCategory.COMP_ASSESSMENT
        || this.content.primaryCategory === NsContent.EPrimaryCategory.OFFLINE_SESSION
        || !(this.content.children && this.content.children.length)
      if (isResource) {
        this.mobileAppsSvc.sendViewerData(this.content)
      }
      return isResource
    }
    return false
  }

  get getStartDate() {
    if (this.enrolledCourseData) {
      const now = new Date().getTime()
      // const batch = _.first(_.filter(this.content['batches'], { batchId: this.currentCourseBatchId }) || [])
      const batch = this.enrolledCourseData.batch
      this.currentCourseBatchId = batch.batchId
      if (batch && this.currentCourseBatchId) {
        this.startDate = (_.get(batch, 'startDate'))
        // const parsedDate = moment(this.startDate);
        // const dateOnly = parsedDate.clone().startOf('day');
        const startDateTime = this.startDate && new Date(this.startDate).getTime()
        this.startDateDifference = startDateTime - now
        if (this.startDateDifference && this.startDateDifference > 0) {
          const days = Math.floor(this.startDateDifference / (1000 * 60 * 60 * 24))
          const hours = Math.floor((this.startDateDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((this.startDateDifference % (1000 * 60 * 60)) / (1000 * 60))
          return (`${days} Days : ${hours} Hours : ${minutes} Minutes`)
        }
          return 'NA'
      }
        return 'NA'
      // if (_.get(batch, 'startDate') && moment(_.get(batch, 'startDate')).isAfter()) {
      //   return moment(_.get(batch, 'startDate')).from(now)
      // }
      // if (_.get(batch, 'endDate') && moment(_.get(batch, 'endDate')).isBefore()) {
      //   return 'NA'
      // }
      // if (startDateTime && moment(startDateTime).isAfter())  {
      //   return moment(startDateTime).from(now)
      // }
      // if (endDateTime && moment(endDateTime).isBefore()) {
      //     return 'NA'
      //   }
      // return 'NA'
    } return 'NA'
  }

  get isBatchInProgress() {
    // if (this.content && this.content['batches']) {
    // const batches = this.content['batches'] as NsContent.IBatch
    // if (this.currentCourseBatchId) {
    //   // const now = moment().format('YYYY-MM-DD HH:mm:ss')
    //   const now = new Date().getTime()
    //   if (this.batchData && this.batchData.content) {
    //     const batch = _.first(_.filter(this.batchData.content, { batchId: this.currentCourseBatchId }) || [])
    //     if (batch) {
    //       // const startDate = moment(batch.startDate).format('YYYY-MM-DD HH:mm:ss')
    //       // const endDate = batch.endDate ? moment(batch.endDate).format('YYYY-MM-DD HH:mm:ss') : now
    //       // return (
    //       //   // batch.status &&
    //       //   moment(startDate).isSameOrBefore(now)
    //       //   && moment(endDate).isSameOrAfter(now)
    //       // )
    //       this.startDate = batch && (_.get(batch, 'startTime'))
    //       this.endDate = batch && (_.get(batch, 'endTime'))
    //       const endDateTime = new Date(this.endDate).getTime()
    //       this.endDateDifference = endDateTime - now
    //       if(this.endDateDifference > 0) {
    //       return  batch.status
    //       }
    //     }
    //     return false
    //   }
    //   return false
    // } return false

    if (this.enrolledCourseData) {
      const now = new Date().getTime()
      const batch = this.enrolledCourseData.batch
      this.currentCourseBatchId = batch.batchId
      if (batch && this.currentCourseBatchId) {
        this.startDate = (_.get(batch, 'startDate'))
        this.endDate = (_.get(batch, 'endDate'))
        if (this.endDate) {
          const startDateTime = this.startDate && new Date(this.startDate).getTime()
          const endDateTime = this.endDate && new Date(this.endDate).getTime()
          this.startDateDifference = now - startDateTime
          this.endDateDifference = endDateTime - now
          if (this.endDateDifference > 0 && this.startDateDifference > 0 && batch.status !== 2) {
            return true
          }
          return false
        }
        return true
      }
      return false
    }
    return false
  }

  private initData(data: Data) {
    const initData = this.tocSvc.initData(data, true)
    this.errorCode = initData.errorCode
    switch (this.errorCode) {
      case NsAppToc.EWsTocErrorCode.API_FAILURE: {
        this.errorWidgetData.widgetData.errorType = ErrorType.internalServer
        break
      }
      case NsAppToc.EWsTocErrorCode.INVALID_DATA: {
        this.errorWidgetData.widgetData.errorType = ErrorType.internalServer
        break
      }
      case NsAppToc.EWsTocErrorCode.NO_DATA: {
        this.errorWidgetData.widgetData.errorType = ErrorType.internalServer
        break
      }
      default: {
        this.errorWidgetData.widgetData.errorType = ErrorType.somethingWrong
        break
      }
    }
    if (!this.forPreview) {
      this.getUserRating(false)
      this.getUserEnrollmentList()
    }
    this.body = this.domSanitizer.bypassSecurityTrustHtml(
      this.content && this.content.body
        ? this.forPreview
          ? this.authAccessControlSvc.proxyToAuthoringUrl(this.content.body)
          : this.content.body
        : '',
    )

    this.contentParents = {}
    this.tocStructure = {
      assessment: 0,
      course: 0,
      handsOn: 0,
      interactiveVideo: 0,
      learningModule: 0,
      other: 0,
      pdf: 0,
      survey: 0,
      podcast: 0,
      practiceTest: 0,
      finalTest: 0,
      quiz: 0,
      video: 0,
      webModule: 0,
      webPage: 0,
      youtube: 0,
      interactivecontent: 0,
      offlineSession: 0,
    }

    if (this.content) {
      this.hasTocStructure = false
      this.tocStructure.learningModule = this.content.primaryCategory === this.primaryCategory.MODULE ? -1 : 0
      this.tocStructure.course = this.content.primaryCategory === this.primaryCategory.COURSE ? -1 : 0
      this.tocStructure = this.tocSvc.getTocStructure(this.content, this.tocStructure)
      for (const progType in this.tocStructure) {
        if (this.tocStructure[progType] > 0) {
          this.hasTocStructure = true
          break
        }
      }

      // from ngOnChanges
      this.fetchExternalContentAccess()
      this.modifySensibleContentRating()
      this.assignPathAndUpdateBanner(this.router.url)
      this.getLearningUrls()
    }

    this.actionSVC.getUpdateCompGroupO.subscribe((res: any) => {
      this.resumeDataLink = res
    })

    if (this.content && this.isPostAssessment) {
      this.tocSvc.fetchPostAssessmentStatus(this.content.identifier).subscribe(res => {
        const assessmentData = res.result
        for (const o of assessmentData) {
          if (o.contentId === (this.content && this.content.identifier)) {
            this.showTakeAssessment = o
            break
          }
        }
      })
    }

    // from ngOnChanges
    this.batchControl.valueChanges.subscribe((batch: NsContent.IBatch) => {
      this.disableEnrollBtn = true
      let userId = ''
      if (batch) {
        if (this.configSvc.userProfile) {
          userId = this.configSvc.userProfile.userId || ''
        }

        const req = {
          request: {
            userId,
            courseId: batch.courseId,
            batchId: batch.batchId,
          },
        }
        this.contentSvc.enrollUserToBatch(req).then((datab: any) => {
          if (datab && datab.result && datab.result.response === 'SUCCESS') {
            this.batchData = {
              content: [batch],
              enrolled: true,
            }
            this.tocSvc.getSelectedBatchData(this.batchData)
            this.tocSvc.mapSessionCompletionPercentage(this.batchData)
            this.router.navigate(
              [],
              {
                relativeTo: this.route,
                queryParams: { batchId: batch.batchId },
                queryParamsHandling: 'merge',
              })
            this.openSnackbar('Enrolled Successfully!')
            this.disableEnrollBtn = false
          } else {
            this.openSnackbar('Something went wrong, please try again later!')
            this.disableEnrollBtn = false
          }
        })
      }
    })

    this.tocSvc.contentLoader.next(false)
  }

  getUserRating(fireUpdate: boolean) {
    if (!this.forPreview) {
      if (this.configSvc.userProfile) {
        this.userId = this.configSvc.userProfile.userId || ''
      }
      if (this.content && this.content.identifier && this.content.primaryCategory) {
        this.ratingSvc.getRating(this.content.identifier, this.content.primaryCategory, this.userId).subscribe(
          (res: any) => {
            if (res && res.result && res.result.response) {
              this.userRating = res.result.response
              if (fireUpdate) {
                this.tocSvc.changeUpdateReviews(true)
              }
            }
          },
          (err: any) => {
            this.loggerSvc.error('USER RATING FETCH ERROR >', err)
          }
        )
      }
    }

    setTimeout(() => {
      if (this.contentSource && this.contentSource.nativeElement.offsetHeight > 44) {
        this.sourceEllipsis = true
      }
    },         250)
  }

  private getUserEnrollmentList() {
    this.enrollBtnLoading = true
    this.tocSvc.contentLoader.next(true)
    this.userSvc.resetTime('enrollmentService')
    // tslint:disable-next-line
    if (this.content && this.content.identifier && this.content.primaryCategory !== this.primaryCategory.COURSE &&
      this.content.primaryCategory !== this.primaryCategory.PROGRAM &&
      this.content.primaryCategory !== this.primaryCategory.MANDATORY_COURSE_GOAL &&
      this.content.primaryCategory !== this.primaryCategory.STANDALONE_ASSESSMENT &&
      this.content.primaryCategory !== this.primaryCategory.BLENDED_PROGRAM &&
      this.content.primaryCategory !== this.primaryCategory.CURATED_PROGRAM) {
      // const collectionId = this.isResource ? '' : this.content.identifier
      return this.getContinueLearningData(this.content.identifier)
    }

    this.userEnrollmentList = []
    let userId: any

    if (this.configSvc.userProfile) {
      userId = this.configSvc.userProfile.userId || ''
    }

    this.userSvc.fetchUserBatchList(userId).toPromise().then(
      async (result: any) => {
        const courses: NsContent.ICourse[] = result && result.courses
        this.userEnrollmentList = courses
        let enrolledCourse: NsContent.ICourse | undefined
        if (this.content && this.content.identifier && !this.forPreview) {
          if (courses && courses.length) {
            enrolledCourse = courses.find((course: any) => {
              const identifier = this.content && this.content.identifier || ''
              if (course.courseId !== identifier) {
                return undefined
              }
              return course
            })
          }

          // If current course is present in the list of user enrolled course
          if (enrolledCourse && enrolledCourse.batchId) {
            this.resumeDataSubscription = this.tocSvc.resumeData.subscribe((res: any) => {
              if (res) {
                this.resumeData = res
                this.getLastPlayedResource()
                this.generateResumeDataLinkNew()
              }
            })
            this.tocSvc.checkModuleWiseData(this.content)
            this.enrolledCourseData = enrolledCourse
            this.isCourseCompletedOnThisMonth()
            this.currentCourseBatchId = enrolledCourse.batchId
            // this.downloadCert(enrolledCourse.issuedCertificates)
            if (enrolledCourse && enrolledCourse.issuedCertificates &&
              enrolledCourse.issuedCertificates.length) {
              const certificate: any = enrolledCourse.issuedCertificates.sort((a: any, b: any) =>
                 new Date(b.lastIssuedOn).getTime() - new Date(a.lastIssuedOn).getTime())
              const certId = certificate[0].identifier
              this.certId = certId
              if (this.content) {
                this.content['certificateObj'] = {
                  certId,
                  certData: '',
                }
              }
            }
            this.content.completionPercentage = enrolledCourse.completionPercentage || 0
            this.content.completionStatus = enrolledCourse.status || 0
            if (this.contentReadData && this.contentReadData.cumulativeTracking) {
              await this.tocSvc.mapCompletionPercentageProgram(this.content, this.userEnrollmentList)
              this.resumeDataSubscription = this.tocSvc.resumeData.subscribe((res: any) => {
                if (res) {
                  this.resumeData = res
                  this.getLastPlayedResource()
                  this.generateResumeDataLinkNew()
                }
              })

              this.enrollBtnLoading = false
              // this.tocSvc.contentLoader.next(false)
            } else {
              this.getContinueLearningData(this.content.identifier, enrolledCourse.batchId)
              this.content['completionPercentage'] = enrolledCourse.completionPercentage
              this.enrollBtnLoading = false
              this.tocSvc.mapModuleCount(this.content)
              // this.tocSvc.contentLoader.next(false)
            }
            this.batchData = {
              content: [enrolledCourse.batch],
              enrolled: true,
            }
            this.tocSvc.setBatchData(this.batchData)
            this.tocSvc.getSelectedBatchData(this.batchData)
            this.tocSvc.mapSessionCompletionPercentage(this.batchData, this.resumeData)
            if (this.getBatchId()) {
              this.router.navigate(
                [],
                {
                  relativeTo: this.route,
                  queryParams: { batchId: this.getBatchId() },
                  queryParamsHandling: 'merge',
                })
            }
          } else {
            this.tocSvc.checkModuleWiseData(this.content)
            this.tocSvc.mapModuleCount(this.content)
            // It's understood that user is not already enrolled
            // Fetch the available batches and present to user
            if (this.content.primaryCategory === this.primaryCategory.COURSE
              || this.content.primaryCategory !== this.primaryCategory.PROGRAM) {
              // Disabling auto enrollment to batch
              if (this.content.primaryCategory === this.primaryCategory.BLENDED_PROGRAM) {
                this.fetchBatchDetails()
              }
            } else {
              this.fetchBatchDetails()
            }
            this.tocSvc.callHirarchyProgressHashmap(this.content)
            this.enrollBtnLoading = false
            // this.tocSvc.contentLoader.next(false)
          }
        }
        // console.log('calling ---------------- =========')
        // this.getLastPlayedResource()
      },
      (error: any) => {
        this.loggerSvc.error('CONTENT HISTORY FETCH ERROR >', error)
      },
    )
  }

  public fetchUserWFForBlended() {
    const applicationIds = (this.batchData && this.batchData.content && this.batchData.content.map(e => e.batchId)) || []
    const req = {
      applicationIds,
      serviceName: 'blendedprogram',
      limit: 100,
      offset: 0,
    }

    this.contentSvc.fetchBlendedUserWF(req).then(
      (data: any) => {
        if (data && data.result && data.result.data.length) {
          const latestWF = _.maxBy(data.result.data[0].wfInfo, (el: any) => {
            return new Date(el.lastUpdatedOn).getTime()
          })
          // latestWF.currentStatus = this.WFBlendedProgramStatus.REJECTED
          /* tslint:disable-next-line */
          this.batchData!.workFlow = {
            wfInitiated: true,
            /* tslint:disable-next-line */
            batch: this.batchData && this.batchData.content && this.batchData.content.find((e: any) => e.batchId === latestWF.applicationId),
            wfItem: latestWF,
          }
          this.tocSvc.setWFData(this.batchData)
        }

        this.loggerSvc.info('fetchBlendedUserWF data == ', data)
      },
      (error: any) => {
        this.loggerSvc.error('CONTENT HISTORY FETCH ERROR >', error)
      },
    )
  }

  public checkIfBatchExists(latest: any) {
    if (!this.batchData || !this.batchData.content) {
      return false
    }
    return this.batchData.content.find(b => b.batchId === latest.batchId)
  }

  public getBatchId(): string {
    let batchId = ''
    if (this.batchData && this.batchData.content) {
      for (const batch of this.batchData.content) {
        batchId = batch.batchId
      }
    }
    return batchId
  }

  // downloadCert(certIdArr: any) {
  //   if (certIdArr && certIdArr.length && certIdArr.length > 0) {
  //     certIdArr.sort((a: any, b: any) => new Date(b.lastIssuedOn).getTime() - new Date(a.lastIssuedOn).getTime())
  //     const certId = certIdArr[0].identifier
  //     this.certId = certId

  //     this.contentSvc.downloadCert(certId).subscribe(response => {
  //       if (this.content) {
  //         this.content['certificateObj'] = {
  //           certData: response.result.printUri,
  //           certId: this.certId,
  //         }
  //       }
  //     })
  //   }
  // }

  public handleAutoBatchAssign() {
    if (this.forPreview) {
      this.navigateToPlayerPage('')
    } else {
      this.enrollBtnLoading = true
      this.changeTab = !this.changeTab
      this.userSvc.resetTime('enrollmentService')
      const batchData = this.contentReadData && this.contentReadData.batches && this.contentReadData.batches[0]
      if (this.content && this.content.primaryCategory === NsContent.EPrimaryCategory.CURATED_PROGRAM) {
        this.autoEnrollCuratedProgram(NsContent.ECourseCategory.CURATED_PROGRAM, batchData)
      } else if (this.content && this.content.courseCategory === NsContent.ECourseCategory.MODERATED_PROGRAM) {
        let moderatedBatchData: any
        if (this.batchData && this.batchData.content && this.batchData.content.length > 1) {
          moderatedBatchData = this.selectedBatchData && this.selectedBatchData.content && this.selectedBatchData.content[0]
        } else {
          moderatedBatchData = this.batchData && this.batchData.content && this.batchData.content[0]
        }
        this.autoEnrollCuratedProgram(NsContent.ECourseCategory.MODERATED_PROGRAM, moderatedBatchData)
      } else {
        this.autoAssignEnroll()
      }
    }
  }

  public autoEnrollCuratedProgram(programType: any, batchData: any) {
    if (this.content && this.content.identifier) {
      let userId = ''
      if (this.configSvc.userProfile && this.configSvc.userProfile.userId) {
        userId = this.configSvc.userProfile.userId
      }
      const req = {
        request: {
          userId,
          programId: this.content.identifier,
          // as of now curated program only one batch is coming need to check and modify
          batchId: batchData.batchId,
        },
      }
      this.contentSvc.autoAssignCuratedBatchApi(req, programType).subscribe(
        (data: NsContent.IBatchListResponse) => {
          if (data) {
            this.userSvc.resetTime('enrollmentService')
            if (programType === NsContent.ECourseCategory.MODERATED_PROGRAM && batchData.endDate) {
              this.batchData = {
                content: [batchData],
                enrolled: true,
              }
              this.router.navigate(
                [],
                {
                  relativeTo: this.route,
                  queryParams: { batchId: batchData.batchId },
                  queryParamsHandling: 'merge',
                })
              setTimeout(() => {
                this.getUserEnrollmentList()
              },         2000)
            } else {
              this.navigateToPlayerPage(req.request.batchId)
            }
          }
        },
        (_error: any) => {
          this.enrollBtnLoading = false
        }
      )
    }
  }

  public autoAssignEnroll() {
    if (this.content && this.content.identifier) {
      this.contentSvc.autoAssignBatchApi(this.content.identifier).subscribe(
        (data: NsContent.IBatchListResponse) => {
          this.batchData = {
            content: data.content,
            enrolled: true,
          }
          const batchId = this.getBatchId()
          if (batchId) {
            // this.createCertTemplate(this.getBatchId(), this.content.identifier)

            // this.router.navigate(
            //   [],
            //   {
            //     relativeTo: this.route,
            //     queryParams: { batchId: this.getBatchId() },
            //     queryParamsHandling: 'merge',
            //   })
            this.navigateToPlayerPage(batchId)
          }
          // this.enrollBtnLoading = false
        },
        (_error: any) => {
          this.enrollBtnLoading = false
        }
      )
    }
  }

  navigateToPlayerPage(batchId: string) {
    if (this.content) {
      this.enrollBtnLoading = true
      const firstPlayableContent = this.contentSvc.getFirstChildInHierarchy(this.content)
      let primaryCategory
      if (this.content.secureSettings !== undefined) {
        primaryCategory = 'Learning Resource'
      } else {
        primaryCategory = firstPlayableContent.primaryCategory || this.content.primaryCategory
      }
      this.firstResourceLink = viewerRouteGenerator(
        firstPlayableContent.identifier,
        firstPlayableContent.mimeType,
        this.isResource ? undefined : this.content.identifier,
        this.isResource ? undefined : this.content.contentType,
        this.forPreview,
        primaryCategory,
        batchId,
      )
      this.router.navigate([`${this.firstResourceLink.url}`], { queryParams: { ...this.firstResourceLink.queryParams } })
    }
  }

  public fetchBatchDetails() {
    if (this.content && this.content.identifier) {
      const req = {
        request: {
          filters: {
            courseId: this.content.identifier,
            status: ['0', '1', '2'],
            // createdBy: 'fca2925f-1eee-4654-9177-fece3fd6afc9',
          },
          sort_by: { createdDate: 'desc' },
        },
      }
      this.contentSvc.fetchCourseBatches(req).subscribe(
        (data: NsContent.IBatchListResponse) => {
          this.batchData = data
          this.batchData.enrolled = false
          this.tocSvc.setBatchData(this.batchData)
          if (this.getBatchId()) {
            this.router.navigate(
              [],
              {
                relativeTo: this.route,
                // queryParams: { batchId: this.getBatchId() },
                queryParamsHandling: 'merge',
              })
          }
        },
        (error: any) => {
          this.loggerSvc.error('CONTENT HISTORY FETCH ERROR >', error)
        },
      )
    }
  }

  private getContinueLearningData(contentId: string, batchId?: string) {
    this.tocSvc.contentLoader.next(true)
    this.resumeData = null
    let userId
    if (this.configSvc.userProfile) {
      userId = this.configSvc.userProfile.userId || ''
    }

    const req: NsContent.IContinueLearningDataReq = {
      request: {
        batchId,
        userId,
        courseId: contentId || '',
        contentIds: [],
        fields: ['progressdetails'],
      },
    }
    if (this.content && this.content.primaryCategory !== NsContent.EPrimaryCategory.RESOURCE) {
      this.contentSvc.fetchContentHistoryV2(req).subscribe(
        data => {
          if (data && data.result && data.result.contentList && data.result.contentList.length) {
            const tempResumeData = _.get(data, 'result.contentList')
            this.resumeData = _.map(tempResumeData, rr => {
              // tslint:disable-next-line
              const items = _.filter(flattenItems(_.get(this.content, 'children') || [], 'children'), { 'identifier': rr.contentId, primaryCategory: 'Learning Resource' })
              _.set(rr, 'progressdetails.mimeType', _.get(_.first(items), 'mimeType'))
              if (!_.get(rr, 'completionPercentage')) {
                if (_.get(rr, 'status') === 2) {
                  _.set(rr, 'completionPercentage', 100)
                } else {
                  _.set(rr, 'completionPercentage', 0)
                }
              }
              return rr
            })
            const progress = _.map(this.resumeData, 'completionPercentage')
            const totalCount = _.toInteger(_.get(this.content, 'leafNodesCount')) || 1
            if (progress.length < totalCount) {
              const diff = totalCount - progress.length
              if (diff) {
                // tslint:disable-next-line
                _.each(new Array(diff), () => {
                  progress.push(0)
                })
              }
            }
            this.generateResumeDataLinkNew()
            this.tocSvc.updateResumaData(this.resumeData)
            // this.tocSvc.mapModuleDurationAndProgress(this.content, this.content)
            this.getLastPlayedResource()
            this.tocSvc.mapCompletionPercentage(this.content, this.resumeData)
            this.tocSvc.callHirarchyProgressHashmap(this.content)
            this.tocSvc.contentLoader.next(false)
          } else {
            this.resumeData = null
            this.tocSvc.callHirarchyProgressHashmap(this.content)
            this.tocSvc.contentLoader.next(false)
          }
        },
        (error: any) => {
          this.loggerSvc.error('CONTENT HISTORY FETCH ERROR >', error)
        },
      )
    }
  }

  generateResumeDataLinkNew() {
    if (this.resumeData && this.content) {
      let resumeDataV2: any
      if (this.content.completionPercentage === 100) {
        resumeDataV2 = this.getResumeDataFromList('start')
      } else {
        resumeDataV2 = this.getResumeDataFromList()
      }
      if (!resumeDataV2.mimeType) {
        resumeDataV2.mimeType = this.tocSvc.getMimeType(this.content, resumeDataV2.identifier)
      }
      this.resumeDataLink = viewerRouteGenerator(
        resumeDataV2.identifier,
        resumeDataV2.mimeType,
        this.isResource ? undefined : this.content.identifier,
        this.isResource ? undefined : this.content.contentType,
        this.forPreview,
        'Learning Resource',
        this.getBatchId(),
        this.content.name,
      )
      this.actionSVC.setUpdateCompGroupO = this.resumeDataLink
      /* tslint:disable-next-line */
    }
  }

  scrollToTop() {
    (function smoothscroll() {
      const currentScroll = document.documentElement.scrollTop || document.body.scrollTop
      if (currentScroll > 0) {
        // window.requestAnimationFrame(smoothscroll)
        // window.scrollTo(0, currentScroll - (currentScroll / 5))
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
      }
    })()
  }

  public getCompetencies(competencies: any) {
    const competenciesArray = JSON.parse(competencies)
    const competencyStringArray: any[] = []
    competenciesArray.map((c: any) => {
      competencyStringArray.push(c.name)
    })
    return competencyStringArray
  }

  get showIntranetMsg() {
    if (this.isMobile) {
      return true
    }
    return this.showIntranetMessage
  }

  get showStart() {
    return this.tocSvc.showStartButton(this.content)
  }

  get isPostAssessment(): boolean {
    if (!(this.tocConfig && this.tocConfig.postAssessment)) {
      return false
    }
    if (this.content) {
      return (
        this.content.primaryCategory === NsContent.EPrimaryCategory.COURSE &&
        this.content.learningMode === 'Instructor-Led'
      )
    }
    return false
  }

  get isMobile(): boolean {
    return this.utilitySvc.isMobile
  }

  get showSubtitleOnBanner() {
    return this.tocSvc.subtitleOnBanners
  }

  public handleEnrollmentEndDate(batch: any) {
    const enrollmentEndDate = dayjs(_.get(batch, 'enrollmentEndDate')).format('YYYY-MM-DD')
    const systemDate = dayjs()
    return enrollmentEndDate ? dayjs(enrollmentEndDate).isBefore(systemDate) : false
  }

  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }

  get showInstructorLedMsg() {
    return (
      this.showActionButtons &&
      this.content &&
      this.content.learningMode === 'Instructor-Led' &&
      !this.content.children.length &&
      !this.content.artifactUrl
    )
  }

  get isHeaderHidden() {
    return this.isResource && this.content && !this.content.artifactUrl.length
  }

  get showActionButtons() {
    return (
      this.actionBtnStatus !== 'wait' &&
      this.content &&
      this.content.status !== 'Deleted' &&
      this.content.status !== 'Expired'
    )
  }

  get showButtonContainer() {
    return (
      this.actionBtnStatus === 'grant' &&
      !(this.isMobile && this.content && this.content.isInIntranet) &&
      !(
        this.content &&
        this.content.contentType === 'Course' &&
        this.content.children.length === 0 &&
        !this.content.artifactUrl
      ) &&
      !(this.content && this.content.contentType === 'Resource' && !this.content.artifactUrl)
    )
  }

  private getResumeDataFromList(type?: string): any | void {
    const resumeCopy = [...this.resumeData]
    if (!type) {
      // tslint:disable-next-line:max-line-length

      const lastItem = resumeCopy && resumeCopy.sort((a: any, b: any) =>
        new Date(b.lastAccessTime).getTime() - new Date(a.lastAccessTime).getTime()).shift()
      return {
        identifier: lastItem.contentId,
        mimeType: lastItem.progressdetails && lastItem.progressdetails.mimeType,
      }
    }
    const firstItem = resumeCopy && resumeCopy.length && resumeCopy[0]
    return {
      identifier: firstItem.contentId,
      mimeType: firstItem.progressdetails && firstItem.progressdetails.mimeType,
    }
  }

  private modifySensibleContentRating() {
    if (
      this.content &&
      this.content.averageRating &&
      typeof this.content.averageRating !== 'number'
    ) {
      this.content.averageRating = (this.content.averageRating as any)[this.configSvc.rootOrg || '']
    }
    if (this.content && this.content.totalRating && typeof this.content.totalRating !== 'number') {
      this.content.totalRating = (this.content.totalRating as any)[this.configSvc.rootOrg || '']
    }
  }

  private getLearningUrls() {
    if (this.content) {
      this.isPracticeVisible = Boolean(
        this.tocSvc.filterToc(this.content, NsContent.EFilterCategory.PRACTICE),
      )

      this.isAssessVisible = Boolean(
        this.tocSvc.filterToc(this.content, NsContent.EFilterCategory.ASSESS),
      )

      const firstPlayableContent = this.contentSvc.getFirstChildInHierarchy(this.content)
      let primaryCategory
      if (this.content.secureSettings !== undefined) {
        primaryCategory = 'Learning Resource'
      } else {
        primaryCategory = firstPlayableContent.primaryCategory || this.content.primaryCategory
      }
      this.firstResourceLink = viewerRouteGenerator(
        firstPlayableContent.identifier,
        firstPlayableContent.mimeType,
        this.isResource ? undefined : this.content.identifier,
        this.isResource ? undefined : this.content.contentType,
        this.forPreview,
        primaryCategory,
        this.getBatchId(),
      )

      /* tslint:disable-next-line */

      if (firstPlayableContent.optionalReading && firstPlayableContent.primaryCategory === 'Learning Resource') {
        this.updateProgress(2, firstPlayableContent.identifier)
      }
    }
  }

  private assignPathAndUpdateBanner(url: string) {
    const path = url.split('/').pop()
    if (path && this.validPaths.has(path)) {
      this.routePath = path
      this.updateBannerUrl()
    }
  }

  private updateBannerUrl() {
    if (this.banners) {
      this.bannerUrl = this.domSanitizer.bypassSecurityTrustStyle(
        `url(${this.banners[this.routePath]})`,
      )
    }
  }

  playIntroVideo() {
    if (this.content) {
      this.dialog.open(AppTocDialogIntroVideoComponent, {
        data: this.content.introductoryVideo,
        height: '350px',
        width: '620px',
      })
    }
  }

  get sanitizedIntroductoryVideoIcon() {
    if (this.content && this.content.introductoryVideoIcon) {
      return this.domSanitizer.bypassSecurityTrustStyle(`url(${this.content.introductoryVideoIcon})`)
    }
    return null
  }

  private fetchExternalContentAccess() {
    if (this.content && this.content.registrationUrl) {
      if (!this.forPreview) {
        this.externalContentFetchStatus = 'fetching'
        this.registerForExternal = false
        this.tocSvc.fetchExternalContentAccess(this.content.identifier).subscribe(
          data => {
            this.externalContentFetchStatus = 'done'
            this.registerForExternal = data.hasAccess
          },
          _error => {
            this.externalContentFetchStatus = 'done'
            this.registerForExternal = false
          },
        )
      } else {
        this.externalContentFetchStatus = 'done'
        this.registerForExternal = true
      }
    }
  }

  getRatingIcon(ratingIndex: number): 'star' | 'star_border' | 'star_half' {
    if (this.content && this.content.averageRating) {
      const avgRating = this.content.averageRating
      const ratingFloor = Math.floor(avgRating)
      if (ratingIndex <= ratingFloor) {
        return 'star'
      }
      if (ratingFloor === ratingIndex - 1 && avgRating % 1 > 0) {
        return 'star_half'
      }
    }
    return 'star_border'
  }

  private checkRegistrationStatus() {
    const source = (this.content && this.content.sourceShortName) || ''
    if (
      !this.forPreview &&
      !this.isRegistrationSupported &&
      this.checkRegistrationSources.has(source)
    ) {
      this.contentSvc
        .getRegistrationStatus(source)
        .then(res => {
          if (res.hasAccess) {
            this.actionBtnStatus = 'grant'
          } else {
            this.actionBtnStatus = 'reject'
            if (res.registrationUrl && this.content) {
              this.content.registrationUrl = res.registrationUrl
            }
          }
        })
        .catch(_err => { })
    } else {
      this.actionBtnStatus = 'grant'
    }
  }

  generateQuery(type: 'RESUME' | 'START_OVER' | 'START'): { [key: string]: string } {
    if (this.firstResourceLink && (type === 'START' || type === 'START_OVER')) {
      let qParams: { [key: string]: string } = {
        ...this.firstResourceLink.queryParams,
        viewMode: type,
        batchId: this.getBatchId(),
      }
      if (this.contextId && this.contextPath) {
        qParams = {
          ...qParams,
          collectionId: this.contextId,
          collectionType: this.contextPath,
        }
      }
      if (this.forPreview) {
        delete qParams.viewMode
      }
      qParams = {
        ...qParams,
        channelId: this.channelId,
      }
      return qParams
    }

    if (this.resumeDataLink && type === 'RESUME') {
      let qParams: { [key: string]: string } = {
        ...this.resumeDataLink.queryParams,
        batchId: this.getBatchId(),
        viewMode: 'RESUME',
        // courseName: this.content ? this.content.name : '',
      }
      if (this.contextId && this.contextPath) {
        qParams = {
          ...qParams,
          collectionId: this.contextId,
          collectionType: this.contextPath,
        }
      }
      if (this.forPreview) {
        delete qParams.viewMode
      }
      qParams = {
        ...qParams,
        channelId: this.channelId,
      }
      return qParams
    }
    if (this.forPreview) {
      return {}
    }
    return {
      batchId: this.getBatchId(),
      viewMode: type,
    }
  }

  get isInIFrame(): boolean {
    try {
      return window.self !== window.top
    } catch (e) {
      return true
    }
  }

  openFeedbackDialog(content: any): void {
    const dialogRef = this.dialog.open(ContentRatingV2DialogComponent, {
      width: '768px',
      data: { content, userId: this.userId, userRating: this.userRating },
    })

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.getUserRating(true)
        this.getUserEnrollmentList()
        this.resetRatingsService.setRatingServiceUpdate(true)
      }
    })
  }

  updateProgress(status: number, resourceId: any) {
    const collectionId = this.route.snapshot.params.id ?
      this.route.snapshot.params.id : ''
    const batchId = this.route.snapshot.queryParams.batchId ?
      this.route.snapshot.queryParams.batchId : ''
    return this.viewerSvc.realTimeProgressUpdateQuiz(resourceId, collectionId, batchId, status)
  }

  getProgramDuration(batchData: any) {
    if (batchData) {
      const startDate = dayjs(dayjs(batchData.startDate).format('YYYY-MM-DD'))
      const endDate = dayjs(dayjs(batchData.endDate).format('YYYY-MM-DD'))
      // adding 1 to include the start date
      return (endDate.diff(startDate, 'days') + 1)
    }
    return ''
  }

  withdrawOrEnroll(data: string) {
    if (data === NsContent.WFBlendedProgramStatus.INITIATE) {
      this.fetchUserWFForBlended()
    }
  }

  getServerDateTime() {
    this.tocSvc.getServerDate().subscribe((response: any) => {
      if (response && response.systemDate) {
        this.tocSvc.changeServerDate(response.systemDate)
        this.tocSvc.changeServerDate(response.systemDate)
        this.serverDate = response.systemDate
      } else {
        this.tocSvc.changeServerDate(new Date().getTime())
      }
      this.findACPB()
      this.getKarmapointsLimit()
    },                                    (_err: any) => {
      this.tocSvc.changeServerDate(new Date().getTime())
    })
  }

  handleCapitalize(str: string, type?: string): string {
    let returnValue = ''
    if (str) {
      if (type === 'name') {
        returnValue = str.split(' ').map(_str => {
          return _str.charAt(0).toUpperCase() + _str.slice(1)
        }).join(' ')
      } else {

        returnValue = str && (str.charAt(0).toUpperCase() + str.slice(1))
      }
    }
    return returnValue
  }

  public handleParseJsonData(s: any) {
    try {
      const parsedString = JSON.parse(s)
      return parsedString
    } catch {
      return []
    }
  }

  handleNavigateToReviews(): void {
    const elementToView = document.getElementById('reviewContainer') as any

    if (elementToView) {
      window.scrollTo({
        top: elementToView.offsetTop,
        behavior: 'smooth',
      })
    }
  }

  raiseCertIntreactTelemetry() {
    this.events.raiseInteractTelemetry(
      {
        type: WsEvents.EnumInteractTypes.CLICK,
        id: 'view-certificate',
        subType: WsEvents.EnumInteractSubTypes.CERTIFICATE,
      },
      {
        id: this.certId,   // id of the certificate
        type: WsEvents.EnumInteractSubTypes.CERTIFICATE,
      })
  }

  translateLabels(label: string, type: any) {
    return this.langtranslations.translateLabel(label, type, '')
  }

  // checkModuleWiseData() {
  //   if (this.content && this.content.children) {
  //     this.content.children.forEach((ele: any) => {
  //       if (ele.primaryCategory === NsContent.EPrimaryCategory.MODULE) {
  //         let moduleResourseCount = 0
  //         let offlineResourseCount = 0
  //         ele.children.forEach((childEle: any) => {
  //           if (childEle.primaryCategory !== NsContent.EPrimaryCategory.OFFLINE_SESSION) {
  //             moduleResourseCount = moduleResourseCount + 1
  //           } else {
  //             offlineResourseCount = offlineResourseCount + 1
  //           }
  //         })
  //         ele['moduleResourseCount'] = moduleResourseCount
  //         ele['offlineResourseCount'] = offlineResourseCount
  //       }
  //     })
  //   }
  // }

  getLastPlayedResource() {
    let firstPlayableContent
    let resumeDataV2: any
    if (this.resumeData && this.resumeData.length > 0 && this.content) {
      if (this.content.completionPercentage === 100) {
        resumeDataV2 = this.getResumeDataFromList('start')
      } else {
        resumeDataV2 = this.getResumeDataFromList()
      }
      this.expandThePath(resumeDataV2.identifier)
    } else {
      if (this.content) {
        firstPlayableContent = this.contentSvc.getFirstChildInHierarchy(this.content)
        this.expandThePath(firstPlayableContent.identifier)

      }
    }
  }

  expandThePath(resourceId: string) {
    if (this.content && resourceId) {
      const path = this.utilitySvc.getPath(this.content, resourceId)
      // console.log('Path :: :: : ', path)
      this.pathSet = new Set(path.map((u: { identifier: any }) => u.identifier))
      // console.log('pathSet ::: ', this.pathSet)
      // path.forEach((node: IViewerTocCard) => {
      //   this.nestedTreeControl.expand(node)
      // })
    }
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

  translateLabel(label: string, type: any) {
    if (label && type) {
      return this.langtranslations.translateLabel(label, type, '')
    }
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe()
    }
    if (this.batchSubscription) {
      this.batchSubscription.unsubscribe()
    }
    if (this.batchDataSubscription) {
      this.batchDataSubscription.unsubscribe()
    }
    this.tocSvc.analyticsFetchStatus = 'none'
    if (this.routerParamSubscription) {
      this.routerParamSubscription.unsubscribe()
    }
    if (this.selectedBatchSubscription) {
      this.selectedBatchSubscription.unsubscribe()
    }
    if (this.resumeDataSubscription) {
      this.resumeDataSubscription.unsubscribe()
    }
    if (this.timerUnsubscribe) {
      this.timerUnsubscribe.unsubscribe()
    }
  }

  programEnrollCall(batchData: any) {
    this.autoEnrollCuratedProgram(NsContent.ECourseCategory.MODERATED_PROGRAM, batchData)
  }

  raiseTelemetryForPublic() {
    this.events.raiseInteractTelemetry(
      {
        type: 'click',
        id: "view-assessment",
        subType:"anonymous-assessment",
      },{},
      {
        module: 'Landing Page',
      })
  }
}
