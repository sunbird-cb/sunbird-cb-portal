import { Component, OnInit, Input, OnChanges, SimpleChanges, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core'
import { Router } from '@angular/router'
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

// tslint:disable-next-line
import _ from 'lodash'
import dayjs from 'dayjs'
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

import { NsWidgetResolver } from '@sunbird-cb/resolver'
import { NsContentStripWithTabs } from '../../../content-strip-with-tabs/content-strip-with-tabs.model'

import { AppTocService } from '@ws/app/src/lib/routes/app-toc/services/app-toc.service'
import { NsContent, RatingService } from '@sunbird-cb/collection/src/public-api'
import { LoggerService, ConfigurationsService, WidgetContentService } from '@sunbird-cb/utils-v2'
import { TimerService } from '@ws/app/src/lib/routes/app-toc/services/timer.service'
import { HandleClaimService } from '../content-services/handle-claim.service'
import { LoadCheckService } from '@ws/app/src/lib/routes/app-toc/services/load-check.service'
import { ReviewComponentDataService } from '../content-services/review-component-data.service'
import { DiscussUtilsService } from '@ws/app/src/lib/routes/discuss/services/discuss-utils.service'
import { ResetRatingsService } from '@ws/app/src/lib/routes/app-toc/services/reset-ratings.service'

import { ReviewsContentComponent } from '../reviews-content/reviews-content.component'
import { CertificateDialogComponent } from '../../certificate-dialog/certificate-dialog.component'
import { environment } from 'src/environments/environment'

interface IStripUnitContentData {
  key: string
  canHideStrip: boolean
  mode?: string
  showStrip: boolean
  widgets?: NsWidgetResolver.IRenderConfigWithAnyData[]
  stripTitle: string
  stripTitleLink?: {
    link: string,
    icon: string
  },
  sliderConfig?: {
    showNavs: boolean,
    showDots: boolean,
    maxWidgets?: number
  },
  tabs?: NsContentStripWithTabs.IContentStripTab[] | undefined,
  stripName?: string
  stripLogo?: string
  description?: string
  stripInfo?: NsContentStripWithTabs.IStripInfo
  noDataWidget?: NsWidgetResolver.IRenderConfigWithAnyData
  errorWidget?: NsWidgetResolver.IRenderConfigWithAnyData
  showOnNoData: boolean
  showOnLoader: boolean
  showOnError: boolean
  loaderWidgets?: any
  stripBackground?: string
  secondaryHeading?: any
  viewMoreUrl: any
}

@Component({
  selector: 'ws-widget-app-toc-about',
  templateUrl: './app-toc-about.component.html',
  styleUrls: ['./app-toc-about.component.scss'],
})

export class AppTocAboutComponent implements OnInit, OnChanges, AfterViewInit, OnChanges, OnDestroy {

  constructor(
    private ratingService: RatingService,
    private loggerService: LoggerService,
    private dialog: MatDialog,
    private matSnackBar: MatSnackBar,
    private loadCheckService: LoadCheckService,
    private timerService: TimerService,
    private tocSvc: AppTocService,
    private configService: ConfigurationsService,
    private discussUtilitySvc: DiscussUtilsService,
    public router: Router,
    private reviewDataService: ReviewComponentDataService,
    private handleClaimService: HandleClaimService,
    private resetRatingsService: ResetRatingsService,
    private contentSvc: WidgetContentService,
  ) {
    this.resetRatingsService.resetRatings$.subscribe((_res: any) => {
      this.fetchRatingSummary()
    })
  }

  @Input() condition: any
  @Input() kparray: any
  @Input() content: NsContent.IContent | null = null
  @Input() skeletonLoader = false
  @Input() sticky = false
  @Input() tocStructure: any
  @Input() pathSet: any
  @Input() config: any
  @Input() resumeData: any
  @Input() forPreview = false
  @Input() showReviews = false
  @Input() batchData: any
  @Input() fromViewer = false
  @Input() selectedBatchData: any
  @Input() selectedTabValue = 0
  @Input() fromMarketPlace ? = false
  @Input() showMarketPlaceCertificate = false
  @ViewChild('summaryElem', { static: false }) summaryElem !: ElementRef
  @ViewChild('objectivesElem', { static: false }) objectivesElem !: ElementRef
  @ViewChild('descElem', { static: false }) descElem !: ElementRef
  @ViewChild('tagsElem', { static: false }) tagsElem !: ElementRef
  @ViewChild('searchTagElem', { static: false }) searchTagElem !: ElementRef

  primaryCategory = NsContent.EPrimaryCategory
  stripsResultDataMap!: { [key: string]: IStripUnitContentData }
  summary = {
    ellipsis: false,
    viewLess: false,
  }
  description = {
    ellipsis: false,
    viewLess: false,
  }
  objectives = {
    ellipsis: false,
    viewLess: false,
  }
  tagsEllipsis = false
  searchTagsEllipsis = false
  competencySelected = ''
  ratingSummary: any
  authReplies: any
  ratingSummaryProcessed: any
  topRatingReviews: any[] = []
  ratingReviews: any[] = []
  latestReviews: any[] = []
  dialogRef: any
  displayLoader = false
  disableLoadMore = false
  lookupLoading: Boolean = true
  lastLookUp: any
  ratingLookup: any
  reviewPage = 1
  reviewDefaultLimit = 2
  lookupLimit = 3
  ratingViewCount = 3
  ratingViewCountDefault = 3
  competenciesObject: any = []
  private destroySubject$ = new Subject<any>()
  viewMoreTags = false
  timerUnsubscribe: any
  downloadCertificateBool = false

  strip: NsContentStripWithTabs.IContentStripUnit = {
    key: 'blendedPrograms',
    logo: '',
    title: 'Blended Program',
    stripTitleLink: {
      link: '',
      icon: '',
    },
    sliderConfig: {
      showNavs : true,
      showDots: false,
    },
    loader: true,
    stripBackground: '',
    titleDescription: 'Blended Program',
    stripConfig: {
      cardSubType: 'standard',
    },
    viewMoreUrl: {
      path: '',
      viewMoreText: 'Show all',
      queryParams: '',
    },
    tabs: [],
    filters: [],
  }

  timer: any = {}
  isMobile = false
  compentencyKey!: NsContent.ICompentencyKeys

  ngOnInit() {

    this.compentencyKey = this.configService.compentency[environment.compentencyVersionKey]
    if (window.innerWidth <= 1200) {
      this.isMobile = true
    } else {
      this.isMobile = false
    }
    if (this.content && this.content.identifier) {
      this.fetchRatingSummary()
      this.loadCompetencies()
    }

    if (this.content && this.content.contentId && this.content.contentId.includes('ext_')) {
      this.loadCompetencies()
    }

    if (this.content) {
      this.content['subTheme'] = this.getSubThemes()
    }
  }

  ngAfterViewInit(): void {
    this.timerUnsubscribe = this.timerService.getTimerData()
    .pipe(takeUntil(this.destroySubject$))
    .subscribe((_timer: any) => {
      this.timer = _timer
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedTabValue && changes.selectedTabValue.currentValue === 0) {
      setTimeout(() => {
        if (!this.isMobile) {
          if (this.summaryElem && this.summaryElem.nativeElement.offsetHeight > 72) {
            this.summary.ellipsis = true
          }

          if (this.descElem && this.descElem.nativeElement.offsetHeight > 72) {
            this.description.ellipsis = true
          }
          if (this.objectivesElem && this.objectivesElem.nativeElement.offsetHeight > 72) {
            this.objectives.ellipsis = true
          }
        } else {
          if (this.summaryElem && this.summaryElem.nativeElement.offsetHeight > 48) {
            this.summary.ellipsis = true
          }

          if (this.descElem && this.descElem.nativeElement.offsetHeight > 48) {
            this.description.ellipsis = true
          }
          if (this.objectivesElem && this.objectivesElem.nativeElement.offsetHeight > 48) {
            this.objectives.ellipsis = true
          }
        }

        if (this.tagsElem && this.tagsElem.nativeElement.offsetHeight > 64) {
          this.tagsEllipsis = true
        }

        if (this.searchTagElem && this.searchTagElem.nativeElement.offsetHeight > 64) {
          this.searchTagsEllipsis = true
        }
      },         500)
    }

    if (changes.skeletonLoader && !changes.skeletonLoader.currentValue) {
      setTimeout(() => {
        this.loadCheckService.componentLoaded(true)
      },         500)
    }

    if (this.content) {
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
      this.tocStructure.learningModule = this.content.primaryCategory === 'Course Unit' ? -1 : 0
      this.tocStructure.course = this.content.primaryCategory === 'Course' ? -1 : 0
      this.tocStructure = this.tocSvc.getTocStructure(this.content, this.tocStructure)
      for (const progType in this.tocStructure) {
        if (this.tocStructure[progType] > 0) {
          break
        }
      }
    }
    this.forPreview = window.location.href.includes('/public/') || window.location.href.includes('&preview=true')
  }

  getSubThemes(): any[] {
    const subThemeArr: any[] = []
    if (this.content && this.content[this.compentencyKey.vKey] && this.content[this.compentencyKey.vKey].length) {
      if (typeof this.content[this.compentencyKey.vKey] === 'string' && this.checkValidJSON(this.content[this.compentencyKey.vKey])) {
        this.content[this.compentencyKey.vKey] = JSON.parse(this.content[this.compentencyKey.vKey])
      }
      this.content[this.compentencyKey.vKey].forEach((_competencyObj: any) => {
        if (subThemeArr.indexOf(_competencyObj[this.compentencyKey.vCompetencySubTheme]) === -1) {
          subThemeArr.push(_competencyObj[this.compentencyKey.vCompetencySubTheme])
        }
      })
    }
    return subThemeArr
  }

  loadCompetencies(): void {
    if (this.content && this.content[this.compentencyKey.vKey] && this.content[this.compentencyKey.vKey].length) {
      const competenciesObject: any = {}
      if (typeof this.content[this.compentencyKey.vKey] === 'string'
        && this.checkValidJSON(this.content[this.compentencyKey.vKey])) {
        this.content[this.compentencyKey.vKey] = JSON.parse(this.content[this.compentencyKey.vKey])
      }
      this.content[this.compentencyKey.vKey].forEach((_obj: any) => {
        if (competenciesObject[_obj[this.compentencyKey.vCompetencyArea]]) {
          if (competenciesObject[_obj[this.compentencyKey.vCompetencyArea]]
            [_obj[this.compentencyKey.vCompetencyTheme]]) {
            const competencyTheme = competenciesObject[_obj[this.compentencyKey.vCompetencyArea]]
              [_obj[this.compentencyKey.vCompetencyTheme]]
            if (competencyTheme.indexOf(_obj[this.compentencyKey.vCompetencySubTheme]) === -1) {
              competencyTheme.push(_obj[this.compentencyKey.vCompetencySubTheme])
            }
          } else {
            competenciesObject[_obj[this.compentencyKey.vCompetencyArea]]
              [_obj[this.compentencyKey.vCompetencyTheme]] = []
            competenciesObject[_obj[this.compentencyKey.vCompetencyArea]]
              [_obj[this.compentencyKey.vCompetencyTheme]]
              .push(_obj[this.compentencyKey.vCompetencySubTheme])
          }
        } else {
          competenciesObject[_obj[this.compentencyKey.vCompetencyArea]] = {}
          competenciesObject[_obj[this.compentencyKey.vCompetencyArea]][_obj[this.compentencyKey.vCompetencyTheme]] = []
          competenciesObject[_obj[this.compentencyKey.vCompetencyArea]][_obj[this.compentencyKey.vCompetencyTheme]]
          .push(_obj[this.compentencyKey.vCompetencySubTheme])
        }
      })

      for (const key in competenciesObject) {
        if (competenciesObject.hasOwnProperty(key)) {
          const _temp: any = {}
          _temp['key'] = key
          _temp['value'] = competenciesObject[key]
          this.competenciesObject.push(_temp)
        }
      }
      this.handleShowCompetencies(this.competenciesObject[0])
    }
  }

  handleShowCompetencies(item: any): void {
    this.competencySelected = item.key
    const valueObj = item.value
    const competencyArray = []
    for (const key in valueObj) {
      if (valueObj.hasOwnProperty(key)) {
        const _tempObj: any = {}
        _tempObj['key'] = key
        _tempObj['value'] = valueObj[key]
        competencyArray.push(_tempObj)
      }
    }

    this.strip['loaderWidgets'] = this.transformCompetenciesToWidget(this.competencySelected, competencyArray, this.strip)
  }

  private transformCompetenciesToWidget(
    competencyArea: string,
    competencyArrObject: any,
    strip: NsContentStripWithTabs.IContentStripUnit) {
    return (competencyArrObject || []).map((content: any, idx: number) => (
      content ? {
        widgetType: 'card',
        widgetSubType: 'competencyCard',
        widgetHostClass: 'mr-4',
        widgetData: {
          content,
          competencyArea,
          cardCustomeClass: strip.customeClass ? strip.customeClass : '',
          context: { pageSection: strip.key, position: idx },
        },
      } : {
        widgetType: 'card',
        widgetSubType: 'competencyCard',
        widgetHostClass: 'mr-4',
        widgetData: {},
      }
    ))
  }

  public handleParseJsonData(s: string) {
    try {
      const parsedString = JSON.parse(s)
      return parsedString
    } catch {
      return []
    }
  }

  fetchRatingSummary() {
    if (this.content && this.content.identifier && this.content.primaryCategory) {
      this.ratingService.getRatingSummary(this.content.identifier, this.content.primaryCategory).subscribe(
        (res: any) => {
          if (res && res.result && res.result.response) {
            this.ratingSummary = res.result.response
          }

          // Hide loader for MatDialog...
          if (this.dialogRef) { this.dialogRef.componentInstance.displayLoader = false }
          this.ratingSummaryProcessed = this.processRatingSummary()
          // this.fetchRatingLookup()
        },
        (err: any) => {
          this.loggerService.error('USER RATING FETCH ERROR >', err)
          this.matSnackBar.open('Unable to fetch rating summary, due to some error!')
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
        limit: this.lookupLimit,
        ...((this.lastLookUp && this.lastLookUp.updatedOnUUID) ? { updateOn: (this.lastLookUp && this.lastLookUp.updatedOnUUID) } : null),
      }

      this.ratingService.getRatingLookup(req).subscribe(
        (res: any) => {
          // To disable the loader in the modal.
          if (this.dialogRef) {
            this.dialogRef.componentInstance.displayLoader = false
          }

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
          if (this.dialogRef) {   // To disable the loader in the modal.
            this.dialogRef.componentInstance.displayLoader = false
          }

          this.loggerService.error('USER RATING FETCH ERROR >', err)
          this.matSnackBar.open('Unable to load reviews, due to some error!')
        }
      )
    }
  }

  processRatingLookup(response: any) {
    if (response) {
      if (response && response.length < this.lookupLimit) {
        this.disableLoadMore = true
      } else {
        this.disableLoadMore = false
      }
      this.lastLookUp = response[response.length - 1]
      this.ratingReviews = this.ratingLookup
      this.authReplies = []
      this.authReplies = _.keyBy(this.latestReviews, 'userId')
      const userIds = _.map(this.latestReviews, 'userId')
      if (this.content && userIds) {
        this.getAuthorReply(this.content.identifier, this.content.primaryCategory, userIds)
      }

      if (this.ratingReviews) {
        this.ratingReviews = this.ratingReviews.slice()
        this.reviewDataService.setReviewData(this.ratingReviews)
      }
    }
  }

  getAuthorReply(identifier: string, primaryCategory: NsContent.EPrimaryCategory, userIds: any[]) {
    const request = {
      request: {
        activityId: identifier,
        activityType: primaryCategory,
        userId: userIds,
      },
    }

    return this.ratingService.getRatingReply(request).subscribe(
      (res: any) => {
        if (res && res.result && res.result.content) {
          const ratingAuthReplay = res.result.content
          _.forEach(ratingAuthReplay, value => {
              if (this.authReplies[value.userId]) {
                this.authReplies[value.userId]['comment'] = value.comment
                this.authReplies[value.userId]['userId'] = value.userId
              }
          })
        }

        this.latestReviews = Object.values(this.authReplies)
        return this.authReplies
      },
      (err: any) => {
        this.loggerService.error('USER RATING FETCH ERROR >', err)
        this.matSnackBar.open('Unable to fetch author replies, due to some error!')
      }
    )
  }

  countStarsPercentage(value: any, key: any, total: any) {
    if (value && total) {
      return (((value * key) / total) * 100).toFixed(2)
    }
    return 0
  }

  processRatingSummary() {
    const breakDownArray: any[] = []
    const ratingSummaryPr = {
      breakDown: breakDownArray,
      latest50Reviews: breakDownArray,
      ratingsNumber: breakDownArray,
      total_number_of_ratings: _.get(this.ratingSummary, 'total_number_of_ratings') || 0,
      avgRating: 0,
    }

    const totRatings = _.get(this.ratingSummary, 'sum_of_total_ratings') || 0
    ratingSummaryPr.breakDown.push({
      percent: this.countStarsPercentage(_.get(this.ratingSummary, 'totalcount1stars'), 1, totRatings),
      key: 1,
      value: _.get(this.ratingSummary, 'totalcount1stars'),
    })
    ratingSummaryPr.breakDown.push({
      percent: this.countStarsPercentage(_.get(this.ratingSummary, 'totalcount2stars'), 2, totRatings),
      key: 2,
      value: _.get(this.ratingSummary, 'totalcount2stars'),
    })
    ratingSummaryPr.breakDown.push({
      percent: this.countStarsPercentage(_.get(this.ratingSummary, 'totalcount3stars'), 3, totRatings),
      key: 3,
      value: _.get(this.ratingSummary, 'totalcount3stars'),
    })
    ratingSummaryPr.breakDown.push({
      percent: this.countStarsPercentage(_.get(this.ratingSummary, 'totalcount4stars'), 4, totRatings),
      key: 4,
      value: _.get(this.ratingSummary, 'totalcount4stars'),
    })
    ratingSummaryPr.breakDown.push({
      percent: this.countStarsPercentage(_.get(this.ratingSummary, 'totalcount5stars'), 5, totRatings),
      key: 5,
      value: _.get(this.ratingSummary, 'totalcount5stars'),
    })

    if (this.ratingSummary && this.ratingSummary.latest50Reviews) {
      const latest50Reviews = JSON.parse(this.ratingSummary.latest50Reviews)
      const modifiedReviews = _.map(latest50Reviews, rating => {
        rating['userId'] =  rating.user_id
        return rating
      })
      this.authReplies = []
      this.authReplies = _.keyBy(latest50Reviews, 'user_id')
      const userIds = _.map(latest50Reviews, 'user_id')
      if (this.content) {
        this.getAuthorReply(this.content.identifier, this.content.primaryCategory, userIds)
      }

      ratingSummaryPr.latest50Reviews = modifiedReviews
      this.ratingReviews = modifiedReviews
      this.topRatingReviews = modifiedReviews
    }
    // To pass data to the review content
    this.reviewDataService.setReviewData(this.ratingReviews)

    if (this.ratingSummary && this.ratingSummary.total_number_of_ratings) {
      ratingSummaryPr.avgRating =
      parseFloat((this.ratingSummary.sum_of_total_ratings / this.ratingSummary.total_number_of_ratings).toFixed(1))
    }

    if (this.content) {
      this.content.averageRating = ratingSummaryPr.avgRating
      this.content.totalRating = ratingSummaryPr.total_number_of_ratings
    }
    return ratingSummaryPr
  }

  handleCapitalize(str: string, type?: string): string {
    let tempStr = str
    if (tempStr) {
      tempStr = tempStr.split('_x000D_,').join('')
    }
    let returnValue = ''
    if (tempStr && type === 'name') {
      returnValue = tempStr.split(' ').map(_str => {
        return _str.charAt(0).toUpperCase() + _str.slice(1)
      }).join(' ')
    } else {
      returnValue = tempStr && (tempStr.charAt(0).toUpperCase() + tempStr.slice(1))
    }
    return returnValue
  }

  handleOpenReviewModal(): void {
    this.dialogRef = this.dialog.open(ReviewsContentComponent, {
      width: '400px',
      data: { ratings: this.ratingSummaryProcessed, reviews: this.authReplies, latestReviews: this.ratingLookup },
      panelClass: 'ratings-modal-box',
      disableClose: true,
    })

    this.dialogRef.afterClosed().subscribe((_result: any) => {
    })

    this.dialogRef.componentInstance.initiateLoadMore.subscribe((_value: string) => {
      this.loadMore(_value)
    })

    this.dialogRef.componentInstance.loadLatestReviews.subscribe((_value: string) => {
      this.dialogRef.componentInstance.displayLoader = true
      this.ratingViewCount = this.ratingViewCountDefault
      this.lastLookUp = ''
      this.ratingReviews = []
      this.reviewPage = 1
      this.disableLoadMore = false
      this.ratingLookup = []
      if (!this.forPreview) {
        if (_value === 'Latest') {
          this.fetchRatingLookup()
        } else {
          this.fetchRatingSummary()
        }
      }
    })
  }

  loadMore(selectedReview: string) {
    if (!this.disableLoadMore) {
      this.lookupLoading = true
      this.reviewPage = this.reviewPage + 1
      this.ratingViewCount = this.reviewPage * this.reviewDefaultLimit
      if (selectedReview === 'Latest') {
        this.reviewPage = this.reviewPage + 1
        this.ratingViewCount = this.reviewPage * this.reviewDefaultLimit
        this.fetchRatingLookup()
      } else {
        if ((this.reviewPage * this.ratingViewCount) > this.ratingReviews.length) {
          this.disableLoadMore = true
          this.dialogRef.componentInstance.displayLoader = false
        }
        this.reviewPage = this.reviewPage + 1
        this.ratingViewCount = this.reviewPage * this.ratingViewCount
      }
    }
  }

  navigateToDiscussionHub() {
    const config = {
      menuOptions: [
        {
          route: 'all-discussions',
          label: 'All discussions',
          enable: true,
        },
        {
          route: 'categories',
          label: 'Categories',
          enable: true,
        },
        {
          route: 'tags',
          label: 'Tags',
          enable: true,
        },
        {
          route: 'my-discussion',
          label: 'Your discussion',
          enable: true,
        },
        // {
        //   route: 'leaderboard',
        //   label: 'Leader Board',
        //   enable: true,
        // },
      ],
      userName: (this.configService.nodebbUserProfile && this.configService.nodebbUserProfile.username) || '',
      context: {
        id: 1,
      },
      categories: { result: [] },
      routerSlug: '/app',
      headerOptions: false,
      bannerOption: true,
    }
    this.discussUtilitySvc.setDiscussionConfig(config)
    localStorage.setItem('home', JSON.stringify(config))
    this.router.navigate(['/app/discussion-forum'], { queryParams: { page: 'home' }, queryParamsHandling: 'merge' })
  }

  handleClickOfClaim(event: any): void {
    this.handleClaimService.setClaimData(event)
  }

  handleOpenCertificateDialog() {
    this.downloadCertificateBool = true
    const certId = this.content && this.content.certificateObj.certId
    if (this.content && this.content.certificateObj && !this.content.certificateObj.certData) {
      this.contentSvc.downloadCert(certId).subscribe(response => {
        if (this.content) {
          this.downloadCertificateBool = false
          this.content['certificateObj']['certData'] = response.result.printUri
          this.dialog.open(CertificateDialogComponent, {
            width: '1200px',
            data: { cet: response.result.printUri, certId: this.content && this.content.certificateObj.certId },
          })
        }
      },                                             (error: any) => {
        this.downloadCertificateBool = false
        this.loggerService.error('CERTIFICATE FETCH ERROR >', error)
        this.matSnackBar.open('Unable to View Certificate, due to some error!')
      })
    } else {
      this.downloadCertificateBool = false
      this.dialog.open(CertificateDialogComponent, {
        width: '1200px',
        data: { cet: this.content && this.content.certificateObj.certData, certId: this.content && this.content.certificateObj.certId },
      })
    }
  }

  checkValidJSON(str: any) {
      try {
        JSON.parse(str)
        return true
      } catch (e) {
        return false
      }
  }

  ngOnDestroy(): void {
    this.destroySubject$.unsubscribe()
    this.timerUnsubscribe.unsubscribe()
  }

}
