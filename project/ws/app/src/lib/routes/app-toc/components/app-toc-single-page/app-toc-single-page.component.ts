import { AccessControlService } from '@ws/author'
import { Component, Input, OnDestroy, OnInit, OnChanges } from '@angular/core'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { ActivatedRoute, Data, Router } from '@angular/router'
import { ConfigurationsService, LoggerService, WsEvents, EventService } from '@sunbird-cb/utils'
import { Observable, Subscription, Subject } from 'rxjs'
import { share, debounceTime, switchMap, takeUntil } from 'rxjs/operators'
import { NsAppToc, NsCohorts } from '../../models/app-toc.model'
import { AppTocService } from '../../services/app-toc.service'
import { CreateBatchDialogComponent } from '../create-batch-dialog/create-batch-dialog.component'
import { TitleTagService } from '@ws/app/src/lib/routes/app-toc/services/title-tag.service'
import { MatDialog, MatTabChangeEvent } from '@angular/material'
import { MobileAppsService } from 'src/app/services/mobile-apps.service'
import { ConnectionHoverService } from '@sunbird-cb/collection/src/lib/_common/connection-hover-card/connection-hover.servive'
import { NsContent, NsAutoComplete } from '@sunbird-cb/collection/src/public-api'
// import { IdiscussionConfig } from '@project-sunbird/discussions-ui-v8'
// tslint:disable-next-line
import _ from 'lodash'
import { FormGroup, FormControl } from '@angular/forms'
import { RatingService } from '../../../../../../../../../library/ws-widget/collection/src/lib/_services/rating.service'
@Component({
  selector: 'ws-app-app-toc-single-page',
  templateUrl: './app-toc-single-page.component.html',
  styleUrls: ['./app-toc-single-page.component.scss'],
})
export class AppTocSinglePageComponent implements OnInit, OnChanges, OnDestroy {
  contentTypes = NsContent.EContentTypes
  primaryCategory = NsContent.EPrimaryCategory
  showMoreGlance = false
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
  @Input() content: NsContent.IContent | null = null
  @Input() initialrouteData: any
  routeSubscription: Subscription | null = null
  @Input() forPreview = false
  @Input() resumeData: NsContent.IContinueLearningData | null = null
  @Input() batchData: /**NsContent.IBatchListResponse */ any | null = null
  tocConfig: any = null
  loggedInUserId!: any
  private routeQuerySubscription: Subscription | null = null
  batchId!: string
  isNotEditor = true
  cohortResults: {
    [key: string]: { hasError: boolean; contents: NsCohorts.ICohortsContent[] }
  } = {}
  cohortTypesEnum = NsCohorts.ECohortTypes
  discussionConfig: any = {}
  batchDataLoaded = false
  showDiscussionForum: any
  competencies: any
  howerUser!: any
  searchForm: FormGroup | undefined
  private unsubscribe = new Subject<void>()
  // TODO: TO be removed important
  progress = 50
  ratingSummary: any
  ratingLookup: any
  ratingSummaryProcessed: any
  ratingReviews: any[] = []
  ratingViewCount = 3
  ratingViewCountDefault = 3
  lookupLimit = 3
  sortReviewValues = ['topReviews', 'latestReviews']
  previousFilter = this.sortReviewValues[0]
  lastLookUp: any
  reviewPage = 1
  reviewDefaultLimit = 2
  disableLoadMore = false
  displayLoader = false
  tabSelectedIndex = 0
  updateReviewsSubscription: Subscription | null = null
  // configSvc: any

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private tocSharedSvc: AppTocService,
    private domSanitizer: DomSanitizer,
    private authAccessControlSvc: AccessControlService,
    // private dialog: MatDialog,
    private logger: LoggerService,
    private titleTagService: TitleTagService,
    public createBatchDialog: MatDialog,
    private mobileAppsSvc: MobileAppsService,
    public configSvc: ConfigurationsService,
    private connectionHoverService: ConnectionHoverService,
    private eventSvc: EventService,
    private ratingSvc: RatingService,
    // private discussionEventsService: DiscussionEventsService
  ) {
    if (this.configSvc.restrictedFeatures) {
      this.askAuthorEnabled = !this.configSvc.restrictedFeatures.has('askAuthor')
      this.trainingLHubEnabled = !this.configSvc.restrictedFeatures.has('trainingLHub')
    }
    // if (this.route && this.route.parent) {
    //   this.configSvc = this.route.parent.snapshot.data.profileData
    // }
    // this.route.data.subscribe(data => {
    //   this.askAuthorEnabled = !data.restrictedData.data.has('askAuthor')
    //   this.trainingLHubEnabled = !data.restrictedData.data.has('trainingLHub')
    // })
    this.discussionConfig = {
      // menuOptions: [{ route: 'categories', enable: true }],
      userName: (this.configSvc.nodebbUserProfile && this.configSvc.nodebbUserProfile.username) || '',
    }
  }

  ngOnInit() {

    this.searchForm = new FormGroup({
      sortByControl: new FormControl(this.sortReviewValues[0]),
      searchKey: new FormControl(''),
    })
    if (!this.forPreview) {
      this.forPreview = window.location.href.includes('/author/')
    }
    // if (this.route && this.route.parent) {
    //   this.routeSubscription = this.route.parent.data.subscribe((data: Data) => {
    //     this.initData(data)
    //     this.tocConfig = data.pageData.data
    //   })
    // }
    if (this.initialrouteData) {
      this.initData(this.initialrouteData)
      this.tocConfig = this.initialrouteData.pageData.data
    }
    if (this.configSvc && this.configSvc.userProfile && this.configSvc.userProfile.userId) {
      this.loggedInUserId = this.configSvc.userProfile.userId
    }
    // check if the user has role editor,
    if (this.configSvc && this.configSvc.userRoles &&
      this.configSvc.userRoles.has('editor')
    ) {
      // if editor, create batch button will be shown
      this.isNotEditor = false
    }

    this.searchForm.valueChanges
      .pipe(
        debounceTime(500),
        switchMap(async formValue => {
          // tslint:disable-next-line: no-console
          // console.log('formValue :: ', formValue)
          if (this.previousFilter !== formValue.sortByControl) {
            this.previousFilter = formValue.sortByControl
            this.sortReviews(formValue.sortByControl)
          }
        }),
        takeUntil(this.unsubscribe)
      ).subscribe()

    this.updateReviewsSubscription = this.tocSharedSvc.updateReviewsObservable.subscribe((value: boolean) => {
      if (value) {
        this.updateReviews()
      }
    })

  }

  ngOnChanges() {
    if (this.batchData) {
      // setting tab to focus on "CONTENT tab" if already user is enrolled
      this.tabSelectedIndex = 1
    }
  }

  detailUrl(data: any) {
    // let locationOrigin = environment.sitePath ? `https://${environment.sitePath}` : location.origin
    let locationOrigin = location.origin
    if (this.configSvc.activeLocale && this.configSvc.activeLocale.path) {
      locationOrigin += `/${this.configSvc.activeLocale.path}`
    }
    switch (data.primaryCategory) {
      case NsContent.EPrimaryCategory.CHANNEL:
        return `${locationOrigin}${data.artifactUrl}`
      case NsContent.EPrimaryCategory.KNOWLEDGE_BOARD:
        return `${locationOrigin}/app/knowledge-board/${data.identifier}`
      case NsContent.EPrimaryCategory.KNOWLEDGE_ARTIFACT:
        return `${locationOrigin}/app/toc/${data.identifier}/overview?primaryCategory=${data.primaryCategory}`
      default:
        return `${locationOrigin}/app/toc/${data.identifier}/overview?primaryCategory=${data.primaryCategory}`
    }
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe()
    }
    if (this.routeQuerySubscription) {
      this.routeQuerySubscription.unsubscribe()
    }
    if (this.updateReviewsSubscription) {
      this.updateReviewsSubscription.unsubscribe()
    }
  }

  get showSubtitleOnBanner() {
    return this.tocSharedSvc.subtitleOnBanners
  }
  get showDescription() {
    if (this.content && !this.content.body) {
      return true
    }
    return this.tocSharedSvc.showDescription
  }

  get isResource() {
    if (this.content) {
      const isResource = this.content.primaryCategory === NsContent.EPrimaryCategory.KNOWLEDGE_ARTIFACT ||
        this.content.primaryCategory === NsContent.EPrimaryCategory.RESOURCE || !this.content.children.length
      if (isResource) {
        this.mobileAppsSvc.sendViewerData(this.content)
      }
      return isResource
    }
    return false
  }

  setSocialMediaMetaTags(data: any) {
    this.titleTagService.setSocialMediaTags(
      this.detailUrl(data),
      data.name,
      data.description,
      data.appIcon)
  }

  private initData(data: Data) {
    // debugger
    const initData = this.tocSharedSvc.initData(data)
    this.content = initData.content
    if (this.content && this.content.identifier) {
      this.fetchRatingSummary()
    }
    let competencies = this.content && this.content.competencies_v3 || this.content && this.content.competencies
    const isString = typeof (competencies) === 'string'
    if (competencies && isString) {
      try {
        competencies = JSON.parse(competencies)
      } catch (ex) {
        competencies = []
        this.logger.error('Competency Parse Error', ex)
      }
    }
    this.competencies = competencies || []
    this.discussionConfig.contextIdArr = (this.content) ? [this.content.identifier] : []
    if (this.content) {
      this.discussionConfig.categoryObj = {
        category: {
          name: this.content.name,
          pid: '',
          description: this.content.description,
          context: [
            {
              type: 'course',
              identifier: this.content.identifier,
            },
          ],
        },
      }
    }
    this.discussionConfig.contextType = 'course'
    this.setSocialMediaMetaTags(this.content)
    this.body = this.domSanitizer.bypassSecurityTrustHtml(
      this.content && this.content.body
        ? this.forPreview
          ? this.authAccessControlSvc.proxyToAuthoringUrl(this.content.body)
          : this.content.body
        : '',
    )
    this.contentParents = {}
    this.resetAndFetchTocStructure()
    // this.getTrainingCount()
    // this.getContentParent()
    if (this.content && this.content.identifier) {
      this.fetchCohorts(this.cohortTypesEnum.ACTIVE_USERS, this.content.identifier)
      this.fetchCohorts(this.cohortTypesEnum.AUTHORS, this.content.identifier)
    }
  }
  sanitize(data: any) {
    return this.domSanitizer.bypassSecurityTrustHtml(data)
  }
  getContentParent() {
    if (this.content) {
      const contentParentReq: NsAppToc.IContentParentReq = {
        fields: ['contentType', 'name'],
      }
      this.tocSharedSvc
        .fetchContentParent(this.content.identifier, contentParentReq, this.forPreview)
        .subscribe(
          res => {
            this.parseContentParent(res)
          },
          _err => {
            this.contentParents = {}
          },
        )
    }
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

  parseContentParent(content: NsAppToc.IContentParentResponse) {
    content.collections.forEach(collection => {
      if (!this.contentParents.hasOwnProperty(collection.contentType)) {
        this.contentParents[collection.contentType] = []
      }
      this.contentParents[collection.contentType].push(collection)
      this.parseContentParent(collection)
    })
  }

  resetAndFetchTocStructure() {
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
      this.tocStructure = this.tocSharedSvc.getTocStructure(this.content, this.tocStructure)
      for (const progType in this.tocStructure) {
        if (this.tocStructure[progType] > 0) {
          this.hasTocStructure = true
          break
        }
      }
    }
  }

  // For Learning Hub trainings
  // private getTrainingCount() {
  //   if (
  //     this.trainingLHubEnabled &&
  //     this.content &&
  // this.trainingSvc.isValidTrainingContent(this.content) &&
  //   !this.forPreview
  // ) {
  // this.trainingLHubCount$ = this.trainingApi
  //   .getTrainingCount(this.content.identifier)
  //   .pipe(retry(2))
  //   }
  // }

  // openQueryMailDialog(content: any, data: any) {
  //   const emailArray = []
  //   emailArray.push(data.email)
  //   const dialogdata = {
  //     content,
  //     user: data,
  //     emails: emailArray,
  //   }
  //   dialogdata.user.isAuthor = true
  //   this.dialog.open<BtnMailUserDialogComponent, IBtnMailUser>(
  //     BtnMailUserDialogComponent,
  //     {
  //       // width: '50vw',
  //       minWidth: '40vw',
  //       maxWidth: '80vw',
  //       data: dialogdata,
  //     }
  //   )
  // }

  openDialog(content: any): void {
    const dialogRef = this.createBatchDialog.open(CreateBatchDialogComponent, {
      // height: '400px',
      width: '600px',
      data: { content },
    })
    // dialogRef.componentInstance.xyz = this.configSvc
    dialogRef.afterClosed().subscribe((_result: any) => {
      if (!this.batchId) {
        this.tocSharedSvc.updateBatchData()
      }
    })
  }

  public parseJsonData(s: string) {
    try {
      const parsedString = JSON.parse(s)
      return parsedString
    } catch {
      return []
    }
  }

  // cohorts & learners
  public get enablePeopleSearch(): boolean {
    if (this.configSvc.restrictedFeatures) {
      return !this.configSvc.restrictedFeatures.has('peopleSearch')
    }
    return false
  }

  goToUserProfile(user: NsAutoComplete.IUserAutoComplete) {
    if (this.enablePeopleSearch) {
      this.router.navigate(['/app/person-profile', user.wid])

      // this.router.navigate(['/app/person-profile'], { queryParams: { emailId: user.email } })
    }
  }

  getUserFullName(user: any) {
    // this.getHoverUser(user: any)
    if (user && user.first_name && user.last_name) {

      return `${user.first_name.trim()} ${user.last_name.trim()}`
    }
    return ''
  }

  getHoverUser(user: any) {
    const userId = user.wid
    this.connectionHoverService.fetchProfile(userId).subscribe((res: any) => {
      if (res.profileDetails !== null) {
        this.howerUser = res.profileDetails
      } else {
        this.howerUser = res || {}

      }
      return this.howerUser
    })
  }
  fetchCohorts(cohortType: NsCohorts.ECohortTypes, contentID: any) {
    if (!this.cohortResults[cohortType] && !this.forPreview) {
      this.tocSharedSvc.fetchContentCohorts(cohortType, contentID).subscribe(
        (data: any) => {
          this.cohortResults[cohortType] = {
            contents: _.map(data, d => {
              return {
                first_name: _.get(d, 'first_name'),
                last_name: _.get(d, 'last_name'),
                department: _.get(d, 'department'),
                designation: _.get(d, 'designation'),
                email: _.get(d, 'email'),
                desc: _.get(d, 'desc'),
                uid: _.get(d, 'user_id'),
                last_ts: _.get(d, 'last_ts'),
                phone_No: _.get(d, 'phone_No'),
                city: _.get(d, 'city'),
                userLocation: _.get(d, 'userLocation'),
              }
            }) || [],
            hasError: false,
          }
        },
        () => {
          this.cohortResults[cohortType] = {
            contents: [],
            hasError: true,
          }
        },
      )
    } else if (this.cohortResults[cohortType] && !this.forPreview) {
      return
    } else {
      this.cohortResults[cohortType] = {
        contents: [],
        hasError: false,
      }
    }
  }

  fetchRatingSummary() {
    this.displayLoader = true
    if (this.content && this.content.identifier && this.content.primaryCategory) {
      this.ratingSvc.getRatingSummary(this.content.identifier, this.content.primaryCategory).subscribe(
        (res: any) => {
          this.displayLoader = false
          if (res && res.result && res.result.response) {
            this.ratingSummary = res.result.response
          }

          // TODO: To be removed
          // this.hardcodeData()
          this.ratingSummaryProcessed = this.processRatingSummary()
        },
        (err: any) => {
          this.displayLoader = false
          this.logger.error('USER RATING FETCH ERROR >', err)
          // TODO: To be removed
          // this.hardcodeData()
          // this.ratingSummaryProcessed = this.processRatingSummary()
        }
      )
    }
  }

  fetchRatingLookup() {
    this.displayLoader = true
    if (this.content && this.content.identifier && this.content.primaryCategory) {
      const req = {
        activityId: this.content.identifier,
        activityType: this.content.primaryCategory,
        // this field can be enabled if specific ratings have to be looked up
        // rating: 0,
        limit: this.lookupLimit,
        ...((this.lastLookUp && this.lastLookUp.updatedOnUUID) ? { updateOn: (this.lastLookUp && this.lastLookUp.updatedOnUUID) } : null),
      }
      this.ratingSvc.getRatingLookup(req).subscribe(
        (res: any) => {
          this.displayLoader = false
          // // console.log('Rating summary res ', res)
          if (res && res.result && res.result.response) {
            if (this.reviewPage > 1) {
              res.result.response.map((item: any) => {
                if (!this.ratingLookup.find((o: any) => o.updatedOnUUID === item.updatedOnUUID)) {
                  this.ratingLookup.push(item)
                }
              })
            } else {
              this.ratingLookup = res.result.response
            }
          }

          this.processRatingLookup(res.result.response)
        },
        (err: any) => {
          this.displayLoader = false
          this.logger.error('USER RATING FETCH ERROR >', err)
        }
      )
    }
  }

  showALLReviews(length: number) {
    this.ratingViewCount = length
  }

  processRatingSummary() {
    const breakDownArray: any[] = []
    const ratingSummaryPr = {
      breakDown: breakDownArray,
      latest50Reviews: breakDownArray,
      ratingsNumber: breakDownArray,
      total_number_of_ratings:  _.get(this.ratingSummary, 'total_number_of_ratings') || 0,
      avgRating: 0,
    }

    const totRatings = _.get(this.ratingSummary, 'sum_of_total_ratings') || 0
    ratingSummaryPr.breakDown.push({
      percent: this.countStarsPercentage(_.get(this.ratingSummary, 'totalcount1stars'), totRatings),
      key: 1,
      value: _.get(this.ratingSummary, 'totalcount1stars'),
    })
    ratingSummaryPr.breakDown.push({
      percent: this.countStarsPercentage(_.get(this.ratingSummary, 'totalcount2stars'), totRatings),
      key: 2,
      value: _.get(this.ratingSummary, 'totalcount2stars'),
    })
    ratingSummaryPr.breakDown.push({
      percent: this.countStarsPercentage(_.get(this.ratingSummary, 'totalcount3stars'), totRatings),
      key: 3,
      value: _.get(this.ratingSummary, 'totalcount3stars'),
    })
    ratingSummaryPr.breakDown.push({
      percent: this.countStarsPercentage(_.get(this.ratingSummary, 'totalcount4stars'), totRatings),
      key: 4,
      value: _.get(this.ratingSummary, 'totalcount4stars'),
    })
    ratingSummaryPr.breakDown.push({
      percent: this.countStarsPercentage(_.get(this.ratingSummary, 'totalcount5stars'), totRatings),
      key: 5,
      value: _.get(this.ratingSummary, 'totalcount5stars'),
    })
    // tslint:disable-next-line:max-line-length
    // ratingSummaryPr.latest50Reviews = this.ratingSummary && this.ratingSummary.latest50Reviews ? JSON.parse(this.ratingSummary.latest50Reviews) : []
    // // ratingSummaryPr.latest50Reviews = this.ratingSummary.latest50Reviews
    // this.ratingReviews = this.ratingSummary && this.ratingSummary.latest50Reviews ? JSON.parse(this.ratingSummary.latest50Reviews) : []
    // ratingSummaryPr.avgRating = parseFloat(((((totRatings / this.ratingSummary.total_number_of_ratings) * 100) * 5) / 100).toFixed(1))
    if (this.ratingSummary && this.ratingSummary.latest50Reviews) {
      ratingSummaryPr.latest50Reviews = JSON.parse(this.ratingSummary.latest50Reviews)
      this.ratingReviews = JSON.parse(this.ratingSummary.latest50Reviews)
    }
    const meanRating = ratingSummaryPr.breakDown.reduce((val, item) => {
      // console.log('item', item)
      return val + (item.key * item.value)
      // tslint:disable-next-line: align
    }, 0)
    // tslint:disable-next-line:max-line-length
    // ratingSummaryPr.avgRating = this.ratingSummary && this.ratingSummary.total_number_of_ratings ? parseFloat((meanRating / this.ratingSummary.total_number_of_ratings).toFixed(1)) : 0

    if (this.ratingSummary && this.ratingSummary.total_number_of_ratings) {
      ratingSummaryPr.avgRating = parseFloat((meanRating / this.ratingSummary.total_number_of_ratings).toFixed(1))
    }
    if (this.content) {
      this.content.averageRating = ratingSummaryPr.avgRating
      this.content.totalRating = ratingSummaryPr.total_number_of_ratings
    }
    // ratingSummaryPr.avgRating = 5
    return ratingSummaryPr
  }

  processRatingLookup(response: any) {
    if (response.length < this.lookupLimit) {
      this.disableLoadMore = true
    } else {
      this.disableLoadMore = false
    }
    this.lastLookUp = response[response.length - 1]
    this.ratingReviews = this.ratingLookup
    this.ratingReviews = this.ratingReviews.slice()
  }

  countStarsPercentage(value: any, total: any) {
    return ((value / total) * 100).toFixed(2)
  }

  getRatingIcon(ratingIndex: number, avg: number): 'star' | 'star_border' | 'star_half' {
    return this.ratingSvc.getRatingIcon(ratingIndex, avg)
  }

  getRatingIconClass(ratingIndex: number, avg: number): boolean {
    return this.ratingSvc.getRatingIconClass(ratingIndex, avg)
  }

  sortReviews(sort: string) {
    // Reset the counters/ previous values before changing the filter and view
    this.ratingViewCount = this.ratingViewCountDefault
    this.lastLookUp = ''
    this.ratingReviews = []
    this.reviewPage = 1
    this.disableLoadMore = false
    this.ratingLookup = []

    if (sort === this.sortReviewValues[0]) {
      this.fetchRatingSummary()
    } else {
      this.fetchRatingLookup()
    }
  }

  // To updated both reviews, and rating summary at once in case of edit scenario
  updateReviews() {
    // Reset the counters/ previous values before changing the filter and view
    this.ratingViewCount = this.ratingViewCountDefault
    this.lastLookUp = ''
    this.ratingReviews = []
    this.reviewPage = 1
    this.disableLoadMore = false
    this.ratingLookup = []
    this.fetchRatingSummary()
    if (this.previousFilter !== this.sortReviewValues[0]) {
      this.fetchRatingLookup()
    }
  }

  get usr() {
    return this.howerUser
  }

  public tabClicked(tabEvent: MatTabChangeEvent) {
    const data: WsEvents.ITelemetryTabData = {
      label: `${tabEvent.tab.textLabel}`,
      index: tabEvent.index,
    }
    this.eventSvc.handleTabTelemetry(
      WsEvents.EnumInteractSubTypes.COURSE_TAB,
      data,
      {
        id: this.content && this.content.identifier,
        type: this.content && this.content.primaryCategory,
      }
    )
  }

  loadMore() {
    if (!this.disableLoadMore) {
      // tslint:disable-next-line: no-non-null-assertion
      if ((this.searchForm!.get!('sortByControl')!.value === this.sortReviewValues[0])) {
        if ((this.reviewPage * this.ratingViewCount) > this.ratingReviews.length) {
          this.disableLoadMore = true
        }
        this.reviewPage = this.reviewPage + 1
        this.ratingViewCount = this.reviewPage * this.ratingViewCount
      } else {
        this.reviewPage = this.reviewPage + 1
        this.ratingViewCount = this.reviewPage * this.reviewDefaultLimit
        this.fetchRatingLookup()
      }
    }
  }
}
