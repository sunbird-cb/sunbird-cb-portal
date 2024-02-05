import { Component, OnInit, Input } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material'
// tslint:disable-next-line
import _ from 'lodash'

import { ReviewsContentComponent } from '../reviews-content/reviews-content.component'
import { NsContent, RatingService } from '@sunbird-cb/collection/src/public-api'
import { LoggerService } from '@sunbird-cb/utils/src/public-api'

import { NsWidgetResolver } from '@sunbird-cb/resolver'
import { NsContentStripWithTabs } from '../../../content-strip-with-tabs/content-strip-with-tabs.model'

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

export class AppTocAboutComponent implements OnInit {

  @Input() content: NsContent.IContent | null = null
  @Input() skeletonLoader = false
  stripsResultDataMap!: { [key: string]: IStripUnitContentData }
  descEllipsis = false
  summaryEllipsis = false
  competencySelected = ''
  ratingSummary: any
  authReplies: any
  ratingSummaryProcessed: any
  ratingReviews: any[] = []
  reviews: any[] = []
  dialogRef: any
  displayLoader = false
  disableLoadMore = false
  lookupLimit = 3
  lookupLoading: Boolean = true
  lastLookUp: any
  ratingLookup: any
  reviewPage = 1
  ratingViewCount = 3
  reviewDefaultLimit = 2
  competenciesObject: any = {}

  strip: NsContentStripWithTabs.IContentStripUnit = {
    active: true,
    key: 'blendedPrograms',
    logo: 'school',
    title: 'Blended Program',
    stripTitleLink: {
      link: '',
      icon: '',
    },
    sliderConfig: {
      showNavs : false,
      showDots: false,
    },
    loader: true,
    stripBackground: '',
    titleDescription: 'Blended Program',
    stripConfig: {
      cardSubType: 'standard',
    },
    viewMoreUrl: {
      path: '/app/seeAll',
      viewMoreText: 'Show all',
      queryParams: {
        key: 'blendedPrograms',
      },
      loaderConfig: {
        cardSubType: 'card-portrait-click-skeleton',
      },
      stripConfig: {
        cardSubType: 'card-portrait-click',
      },
    },
    tabs: [],
    filters: [],
  }

  // tslint:disable-next-line:max-line-length
  tags = ['Self-awareness', 'Awareness', 'Law', 'Design', 'Manager', 'Management', 'Designer', 'Product', 'Project Manager', 'Product management', 'Technology', 'Software', 'Artificial', 'Chatgpt', 'AI', 'Law rules']

  constructor(
    private ratingService: RatingService,
    private loggerService: LoggerService,
    private dialog: MatDialog,
    private matSnackBar: MatSnackBar
  ) { }

  ngOnInit() {
    if (this.content && this.content.identifier) {
      this.fetchRatingSummary()
      this.loadCompetencies()
    }
  }

  loadCompetencies(): void {
    if (this.content && this.content.competencies_v5 && this.content.competencies_v5.length) {
      this.content.competencies_v5.forEach((_obj: any) => {
        if (this.competenciesObject[_obj.competencyArea]) {
          if (this.competenciesObject[_obj.competencyArea][_obj.competencyTheme]) {
            const competencyTheme = this.competenciesObject[_obj.competencyArea][_obj.competencyTheme]
            if (competencyTheme.indexOf(_obj.competencySubTheme) === -1) {
              competencyTheme.push(_obj.competencySubTheme)
            }
          } else {
            this.competenciesObject[_obj.competencyArea][_obj.competencyTheme] = []
            this.competenciesObject[_obj.competencyArea][_obj.competencyTheme].push(_obj.competencySubTheme)
          }
        } else {
          this.competenciesObject[_obj.competencyArea] = {}
          this.competenciesObject[_obj.competencyArea][_obj.competencyTheme] = []
          this.competenciesObject[_obj.competencyArea][_obj.competencyTheme].push(_obj.competencySubTheme)
        }
      })

      this.handleShowCompetencies(this.competenciesObject)
    }
  }

  handleShowCompetencies(item: any, selectedFlag?: string): void {
    this.competencySelected = (selectedFlag) ? item.key : Object.keys(item)[0]
    const valueObj = (selectedFlag) ? item.value : Object.values(item)[0]
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

          this.ratingSummaryProcessed = this.processRatingSummary()
          this.fetchRatingLookup()
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
          if (this.dialogRef) {   // To disable the loader in the modal.
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
      this.authReplies = _.keyBy(this.ratingReviews, 'userId')
      const userIds = _.map(this.ratingReviews, 'userId')
      if (this.content && userIds) {
        this.getAuthorReply(this.content.identifier, this.content.primaryCategory, userIds)
      }
      this.ratingReviews = this.ratingReviews.slice()
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

        this.reviews = Object.values(this.authReplies)
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
    }

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

  handleCapitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  handleOpenReviewModal(): void {
    this.dialogRef = this.dialog.open(ReviewsContentComponent, {
      width: '400px',
      data: { ratings: this.ratingSummaryProcessed, reviews: this.authReplies },
      panelClass: 'ratings-modal-box',
      disableClose: true,
    })

    this.dialogRef.afterClosed().subscribe((_result: any) => {
    })

    this.dialogRef.componentInstance.initiateLoadMore.subscribe((_value: any) => {
      this.loadMore()
    })
  }

  loadMore() {
    if (!this.disableLoadMore) {
      this.lookupLoading = true
      this.reviewPage = this.reviewPage + 1
      this.ratingViewCount = this.reviewPage * this.reviewDefaultLimit
      this.fetchRatingLookup()
    }
  }

}
