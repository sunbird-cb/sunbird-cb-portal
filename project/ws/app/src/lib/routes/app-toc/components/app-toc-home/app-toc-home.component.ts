import { Component, OnDestroy, OnInit, AfterViewInit, AfterViewChecked, HostListener, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core'
import { ActivatedRoute, Event, Data, Router, NavigationEnd } from '@angular/router'
import {
  NsContent,
  WidgetContentService,
  WidgetUserService,
  viewerRouteGenerator,
  NsPlaylist,
  NsGoal,
} from '@sunbird-cb/collection'
import { NsWidgetResolver } from '@sunbird-cb/resolver'
import { ConfigurationsService, LoggerService, NsPage, TFetchStatus, UtilityService } from '@sunbird-cb/utils'
import { Subscription, Observable } from 'rxjs'
import { share } from 'rxjs/operators'
import { NsAppToc } from '../../models/app-toc.model'
import { AppTocService } from '../../services/app-toc.service'
import { SafeHtml, DomSanitizer, SafeStyle } from '@angular/platform-browser'
import { AccessControlService } from '@ws/author/src/public-api'
import { FormControl, Validators } from '@angular/forms'
import { MatDialog, MatSnackBar } from '@angular/material'
import { MobileAppsService } from 'src/app/services/mobile-apps.service'
import * as dayjs from 'dayjs'
// tslint:disable-next-line
import _ from 'lodash'
import { AppTocDialogIntroVideoComponent } from '../app-toc-dialog-intro-video/app-toc-dialog-intro-video.component'
import { ActionService } from '../../services/action.service'
import { ContentRatingV2DialogComponent } from '@sunbird-cb/collection/src/lib/_common/content-rating-v2-dialog/content-rating-v2-dialog.component'
import { CertificateDialogComponent } from '@sunbird-cb/collection/src/lib/_common/certificate-dialog/certificate-dialog.component'
import moment from 'moment'
import { RatingService } from '../../../../../../../../../library/ws-widget/collection/src/lib/_services/rating.service'

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
  banners: NsAppToc.ITocBanner | null = null
  showMoreGlance = false
  content: NsContent.IContent | null = null
  errorCode: NsAppToc.EWsTocErrorCode | null = null
  resumeData: any = null
  batchData: NsContent.IBatchListResponse | null = null
  currentCourseBatchId: string | null = null
  userEnrollmentList = null
  routeSubscription: Subscription | null = null
  pageNavbar: Partial<NsPage.INavBackground> = this.configSvc.pageNavBar
  isCohortsRestricted = false
  sticky = false
  isInIframe = false
  forPreview = window.location.href.includes('/author/')
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
  certData: any
  userId: any
  userRating: any
  @HostListener('window:scroll', ['$event'])
  handleScroll() {
    const windowScroll = window.pageYOffset
    if (windowScroll >= this.elementPosition - 100) {
      this.sticky = true
    } else {
      this.sticky = false
    }
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contentSvc: WidgetContentService,
    private userSvc: WidgetUserService,
    private tocSvc: AppTocService,
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
    private ratingSvc: RatingService,
  ) {
    this.historyData = history.state
    this.handleBreadcrumbs()
  }

  ngOnInit() {
    // this.route.fragment.subscribe(fragment => { this.fragment = fragment })
    try {
      this.isInIframe = window.self !== window.top
    } catch (_ex) {
      this.isInIframe = false
    }
    if (this.route) {
      this.routeSubscription = this.route.data.subscribe((data: Data) => {
        this.initialrouteData = data
        this.banners = data.pageData.data.banners
        this.tocSvc.subtitleOnBanners = data.pageData.data.subtitleOnBanners || false
        this.tocSvc.showDescription = data.pageData.data.showDescription || false
        this.tocConfig = data.pageData.data
        this.initData(data)
      })
      this.route.data.subscribe(data => {
        this.tocConfig = data.pageData.data
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
      })
    }
    this.currentFragment = 'overview'
    this.route.fragment.subscribe((fragment: string) => {
      this.currentFragment = fragment || 'overview'
    })
    this.batchSubscription = this.tocSvc.batchReplaySubject.subscribe(
      () => {
        this.fetchBatchDetails()
      },
      () => {
        // tslint:disable-next-line: no-console
        console.log('error on batchSubscription')
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
  }

  ngAfterViewInit() {
    // this.elementPosition = this.menuElement.nativeElement.parentElement.offsetTop
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
      } else {
        // tslint:disable-next-line:max-line-length
        this.breadcrumbs = { url: 'home', titles: [{ title: 'Learn', url: '/page/learn', icon: 'school' }, { title: 'Details', url: 'none' }] }
      }
    }
  }
  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe()
    }
    if (this.batchSubscription) {
      this.batchSubscription.unsubscribe()
    }
    this.tocSvc.analyticsFetchStatus = 'none'
    if (this.routerParamSubscription) {
      this.routerParamSubscription.unsubscribe()
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe()
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
        || !(this.content.children && this.content.children.length)
      if (isResource) {
        this.mobileAppsSvc.sendViewerData(this.content)
      }
      return isResource
    }
    return false
  }
  get getStartDate() {
    if (this.content) {
      const batch = _.first(_.filter(this.content['batches'], { batchId: this.currentCourseBatchId }) || [])
      if (_.get(batch, 'startDate') && moment(_.get(batch, 'startDate')).isAfter()) {
        return moment(_.get(batch, 'startDate')).fromNow()
      }
      if (_.get(batch, 'endDate') && moment(_.get(batch, 'endDate')).isBefore()) {
        return 'NA'
      }
      return 'NA'
    } return 'NA'
  }
  get isBatchInProgress() {
    if (this.content && this.content['batches']) {
      // const batches = this.content['batches'] as NsContent.IBatch
      if (this.currentCourseBatchId) {
        const now = moment()
        const batch = _.first(_.filter(this.content['batches'], { batchId: this.currentCourseBatchId }) || [])
        if (batch) {
          return (
            // batch.status &&
            moment(batch.startDate).isSameOrBefore(now)
            && moment(batch.endDate || new Date()).isSameOrAfter(now)
          )
        }
        return false
      }
      return false
    } return false
  }
  private initData(data: Data) {
    const initData = this.tocSvc.initData(data, true)
    this.content = initData.content
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
    this.getUserRating()
    this.getUserEnrollmentList()
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
      podcast: 0,
      practiceTest: 0,
      quiz: 0,
      video: 0,
      webModule: 0,
      webPage: 0,
      youtube: 0,
      interactivecontent: 0,
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
  }

  getUserRating() {
    if (this.configSvc.userProfile) {
      this.userId = this.configSvc.userProfile.userId || ''
    }
    if (this.content && this.content.identifier && this.content.primaryCategory) {
        this.ratingSvc.getRating(this.content.identifier, this.content.primaryCategory, this.userId).subscribe(
          (res: any) =>  {
            this.userRating = res.result.response[0]
            // this.userRating = {
            //   commentupdatedon: null,
            //   commentby: null,
            //   review: 'Very Nice course but missed few content',
            //   activity_type: 'Course',
            //   activity_id: 'Course 17',
            //   rating: 4.4,
            //   comment: null,
            //   updatedon: '67655da0-7900-11ec-9e2e-2bb786397b6b',
            //   userId: 'user 1',
            //   createdon: '67655da0-7900-11ec-9e2e-2bb786397b6b',
            // }
          },
          (err: any) => {
            this.loggerSvc.error('USER RATING FETCH ERROR >', err)
          }
        )
    }
  }

  private getUserEnrollmentList() {
    // tslint:disable-next-line
    if (this.content && this.content.identifier && this.content.primaryCategory !== this.primaryCategory.COURSE && this.content.primaryCategory !== this.primaryCategory.PROGRAM) {
      // const collectionId = this.isResource ? '' : this.content.identifier
      return this.getContinueLearningData(this.content.identifier)
    }
    this.userEnrollmentList = null
    let userId
    if (this.configSvc.userProfile) {
      userId = this.configSvc.userProfile.userId || ''
    }
    // this.route.data.subscribe(data => {
    //   userId = data.profileData.data.userId
    //   }
    // )
    this.userSvc.fetchUserBatchList(userId).subscribe(
      (courses: NsContent.ICourse[]) => {
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
            this.currentCourseBatchId = enrolledCourse.batchId
            this.downloadCert(enrolledCourse.issuedCertificates)
            // const collectionId = this.isResource ? '' : this.content.identifier
            this.content.completionPercentage = enrolledCourse.completionPercentage || 0
            this.content.completionStatus = enrolledCourse.status || 0
            // this.certificateDownloadTrigger(this.content.completionStatus, enrolledCourse.batchId)
            this.getContinueLearningData(this.content.identifier, enrolledCourse.batchId)
            this.batchData = {
              content: [enrolledCourse.batch],
              enrolled: true,
            }
            this.tocSvc.setBatchData(this.batchData)
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
            // It's understood that user is not already enrolled
            // Fetch the available batches and present to user
            if (this.content.primaryCategory === this.primaryCategory.COURSE
              || this.content.primaryCategory !== this.primaryCategory.PROGRAM) {
              this.autoBatchAssign()
            } else {
              this.fetchBatchDetails()
            }
          }
        }
      },
      (error: any) => {
        this.loggerSvc.error('CONTENT HISTORY FETCH ERROR >', error)
      },
    )
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

  // certificateDownloadTrigger(courseState: number, batchId: string) {
  //   // if (courseState === this.courseCompleteState && this.content && this.configSvc.userProfile) {
  //   let body = {
  //     request: {
  //       courseId: this.content.identifier,
  //       batchId: batchId,
  //       userIds: [
  //         this.configSvc.userProfile.userId
  //       ]
  //     }
  //   }
  //   // this.contentSvc.issueCert(body).subscribe(resp => {
  //   //   if (resp.responseCode === 'OK') {
  //   this.checkIfCertIsReady(this.configSvc.userProfile.userId)

  //   //   }
  //   // })
  //   // }
  // }

  downloadCert(certidArr: any) {
    if (certidArr.length > 0) {
      const certId = certidArr[0].identifier

      this.contentSvc.downloadCert(certId).subscribe(response => {
        this.certData = response.result.printUri
        // var win = window.open();
        // win.document.write('<iframe src="' + url  +
        // '" frameborder="0" style="border:0; top:0px;
        // left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
        // // const doc = new jsPDF();

        // var str = doc.output(response.result.printUri);

        // var iframe = "<iframe width='100%' height='100%' src='" + str + "'></iframe>"
        // var x = window.open();
        // x.document.open();
        // x.document.write(iframe);
        // x.document.close();
      })
    }
  }

  openCertificateDialog() {
    const cet = this.certData
    this.dialog.open(CertificateDialogComponent, {
      // height: '400px',
      width: '1300px',
      data: { cet },
      // panelClass: 'custom-dialog-container',
    })
  }

  public autoBatchAssign() {
    if (this.content && this.content.identifier) {
      this.contentSvc.autoAssignBatchApi(this.content.identifier).subscribe(
        (data: NsContent.IBatchListResponse) => {
          this.batchData = {
            content: data.content,
            enrolled: true,
          }
          if (this.getBatchId()) {
            // this.createCertTemplate(this.getBatchId(), this.content.identifier)

            this.router.navigate(
              [],
              {
                relativeTo: this.route,
                queryParams: { batchId: this.getBatchId() },
                queryParamsHandling: 'merge',
              })
          }
        }
      )
    }
  }

  // createCertTemplate(batchId: string, courseId: string) {
  //   let body = {
  //     "request": {
  //       "batch": {
  //         "batchId": batchId,
  //         "courseId": courseId,
  //         "template": {
  //           "template": "https://igot.blob.core.windows.net/content/content/
  // do_113415159382810624195/artifact/do_113415159382810624195_1637592756199_certificate-shilpa-jain-with-text-2.svg",
  //           "identifier": "do_113415159382810624195",
  //           "previewUrl": "https://igot.blob.core.windows.net/content/
  // content/do_113415159382810624195/artifact/do_113415159382810624195
  // _1637592756199_certificate-shilpa-jain-with-text-2.svg",            "criteria": {
  //             "enrollment": {
  //               "status": 2
  //             }
  //           },
  //           "name": "Completion Certificate",
  //           "issuer": {
  //             "name": "in",
  //             "url": "https://diksha.gov.in/gj/"
  //           },
  //           "signatoryList": [
  //             {
  //               "image": "https://diksha.gov.in/gj/header-logo.png",
  //               "name": "Govt Of India",
  //               "id": "in",
  //               "designation": "Home Minister"
  //             }
  //           ]
  //         }
  //       }
  //     }

  //   }
  //   this.contentSvc.addCertTemplate(body).subscribe(resp => {
  //     console.log(resp)
  //   })
  // }

  // checkIfCertIsReady(userId: string | undefined) {
  //   this.userSvc.fetchUserBatchList(userId).subscribe(
  //     (courses: NsContent.ICourse[]) => {
  //       let enrolledCourse: NsContent.ICourse | undefined
  //       if (this.content && this.content.identifier && !this.forPreview) {
  //         if (courses && courses.length) {
  //           enrolledCourse = courses.find(course => {
  //             const identifier = this.content && this.content.identifier || ''
  //             if (course.courseId !== identifier) {
  //               return undefined
  //             }
  //             return course
  //           })
  //         }
  //         // If current course is present in the list of user enrolled course
  //         if (enrolledCourse && enrolledCourse.batchId) {
  //           this.downloadCert(enrolledCourse.issuedCertificates)
  //         }
  //       }
  //     },
  //     (error: any) => {
  //       this.loggerSvc.error('CONTENT HISTORY FETCH ERROR >', error)
  //     },
  //   )
  // }

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
    this.resumeData = null
    let userId
    if (this.configSvc.userProfile) {
      userId = this.configSvc.userProfile.userId || ''
    }
    // this.route.data.subscribe(data => {
    //   userId = data.profileData.data.userId
    // })
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
            this.resumeData = _.get(data, 'result.contentList')
            this.resumeData = _.map(this.resumeData, rr => {
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

            // commenting this as the completion percentage value for course is fetched from enrolled courses API response
            // const percentage = _.toInteger((_.sum(progress) / progress.length))
            // if (this.content) {
            //   _.set(this.content, 'completionPercentage', percentage)
            // }

            // _.set(this.content, 'progress', _.map(this.resumeData, _d => {
            //   return {
            //     progressStatus: _.get(_d, ''),
            //     showMarkAsComplete: _.get(_d, ''),
            //     markAsCompleteReason: _.get(_d, ''),
            //     progressSupported: _.get(_d, ''),
            //     progress: _.get(_d, '') || 0
            //   }
            // }))
            this.tocSvc.updateResumaData(this.resumeData)
          } else {
            this.resumeData = null
          }
        },
        (error: any) => {
          this.loggerSvc.error('CONTENT HISTORY FETCH ERROR >', error)
        },
      )
    }

  }

  // @HostListener('window:scroll', [])
  // onWindowScroll() {
  //   if ((window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop) > this.showScrollHeight) {
  //     this.showScroll = true
  //   } else if (this.showScroll && (window.pageYOffset || document.documentElement.scrollTop
  //     || document.body.scrollTop) < this.hideScrollHeight) {
  //     this.showScroll = false
  //   }
  // }

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
      // if (i < (competenciesArray.length -1)) {
      //   competencyString.push(`${c.name}, `)
      // } else {
      //   competencyString.push(c.name)
      // }
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

  // get showStart() {
  //   return this.content && this.content.resourceType !== 'Certification'
  // }

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
  // private getResumeDataFromList() {
  //   const lastItem = this.resumeData && this.resumeData.pop()
  //   return {
  //     identifier: lastItem.contentId,
  //     mimeType: lastItem.progressdetails && lastItem.progressdetails.mimeType,
  //   }
  // }
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
      if (!this.forPreview) {
        // this.progressSvc.getProgressFor(this.content.identifier).subscribe(data => {
        //   this.contentProgress = data
        // })
      }
      // this.progressSvc.fetchProgressHashContentsId({
      //   "contentIds": [
      //     "lex_29959473947367270000",
      //     "lex_5501638797018560000"
      //   ]
      // }
      // ).subscribe(data => {
      //   console.log("DATA: ", data)
      // })
      this.isPracticeVisible = Boolean(
        this.tocSvc.filterToc(this.content, NsContent.EFilterCategory.PRACTICE),
      )
      this.isAssessVisible = Boolean(
        this.tocSvc.filterToc(this.content, NsContent.EFilterCategory.ASSESS),
      )
      const firstPlayableContent = this.contentSvc.getFirstChildInHierarchy(this.content)
      this.firstResourceLink = viewerRouteGenerator(
        firstPlayableContent.identifier,
        firstPlayableContent.mimeType,
        this.isResource ? undefined : this.content.identifier,
        this.isResource ? undefined : this.content.contentType,
        this.forPreview,
        this.content.primaryCategory,
        this.getBatchId(),
      )
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
      return qParams
    }
    if (this.resumeDataLink && type === 'RESUME') {
      let qParams: { [key: string]: string } = {
        ...this.resumeDataLink.queryParams,
        batchId: this.getBatchId(),
        viewMode: 'RESUME',
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
      // height: '400px',
      width: '770px',
      data: { content, userId: this.userId, userRating: this.userRating },
    })
    // dialogRef.componentInstance.xyz = this.configSvc
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.getUserRating()
      }
    })
  }
}
