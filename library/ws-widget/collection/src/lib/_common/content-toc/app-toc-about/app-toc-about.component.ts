import { Component, OnInit, Input } from '@angular/core'
import lodash from 'lodash'
import { NsContent } from '@sunbird-cb/collection/src/public-api'

import { RatingService } from '../../../_services/rating.service'
import { LoggerService } from '@sunbird-cb/utils/src/public-api'

@Component({
  selector: 'ws-widget-app-toc-about',
  templateUrl: './app-toc-about.component.html',
  styleUrls: ['./app-toc-about.component.scss'],
})

export class AppTocAboutComponent implements OnInit {

  @Input() content: NsContent.IContent | null = null
  descEllipsis = true
  summaryEllipsis = true
  competencySelected = 'behavioural'
  ratingSummary: any
  authReplies: any
  ratingSummaryProcessed: any
  ratingReviews: any[] = []
  tags = ['Self-awareness', 'Awareness', 'Law', 'Design', 'Manager', 'Management', 'Designer', 'Product', 'Project Manager']

  constructor(
    private ratingService: RatingService,
    private loggerService: LoggerService
  ) { }

  ngOnInit() {
    const tags = ['Product management', 'Technology', 'Software', 'Artificial', 'Chatgpt', 'AI', 'Law rules']
    this.tags = [...this.tags, ...tags]
    if (this.content && this.content.identifier) {
      this.fetchRatingSummary()
    }
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
        },
        (err: any) => {
          this.loggerService.error('USER RATING FETCH ERROR >', err)
        }
      )
    }
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
    // tslint:disable-next-line:max-line-length
    // ratingSummaryPr.latest50Reviews = this.ratingSummary && this.ratingSummary.latest50Reviews ? JSON.parse(this.ratingSummary.latest50Reviews) : []
    // // ratingSummaryPr.latest50Reviews = this.ratingSummary.latest50Reviews
    // this.ratingReviews = this.ratingSummary && this.ratingSummary.latest50Reviews ? JSON.parse(this.ratingSummary.latest50Reviews) : []
    // ratingSummaryPr.avgRating = parseFloat(((((totRatings / this.ratingSummary.total_number_of_ratings) * 100) * 5) / 100).toFixed(1))
    if (this.ratingSummary && this.ratingSummary.latest50Reviews) {
      // ratingSummaryPr.latest50Reviews = JSON.parse(this.ratingSummary.latest50Reviews)
      // this.ratingReviews = JSON.parse(this.ratingSummary.latest50Reviews)
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
    // rating changes 07 march 23
    // const meanRating = ratingSummaryPr.breakDown.reduce((val, item) => {
    //   // console.log('item', item)
    //   return val + (item.key * item.value)
    //   // tslint:disable-next-line: align
    // }, 0)
    // tslint:disable-next-line:max-line-length
    // ratingSummaryPr.avgRating = this.ratingSummary && this.ratingSummary.total_number_of_ratings ? parseFloat((meanRating / this.ratingSummary.total_number_of_ratings).toFixed(1)) : 0

    if (this.ratingSummary && this.ratingSummary.total_number_of_ratings) {
      // ratingSummaryPr.avgRating = parseFloat((meanRating / this.ratingSummary.total_number_of_ratings).toFixed(1))
      ratingSummaryPr.avgRating =
      parseFloat((this.ratingSummary.sum_of_total_ratings / this.ratingSummary.total_number_of_ratings).toFixed(1))
    }
    if (this.content) {
      this.content.averageRating = ratingSummaryPr.avgRating
      this.content.totalRating = ratingSummaryPr.total_number_of_ratings
    }
    // ratingSummaryPr.avgRating = 5
    return ratingSummaryPr
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
        return this.authReplies
      },
      (err: any) => {
        this.loggerService.error('USER RATING FETCH ERROR >', err)
      }
    )
  }

  handleCapitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  // handleTabChange(event: MatTabChangeEvent): void {}

}
