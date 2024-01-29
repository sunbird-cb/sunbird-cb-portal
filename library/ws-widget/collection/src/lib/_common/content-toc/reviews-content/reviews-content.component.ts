import { Component, OnInit, ViewChild, Inject, ElementRef } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import _ from 'lodash'

import { NsContent, RatingService } from '@sunbird-cb/collection/src/public-api'
import { LoggerService } from '@sunbird-cb/utils/src/public-api'

@Component({
  selector: 'ws-widget-reviews-content',
  templateUrl: './reviews-content.component.html',
  styleUrls: ['./reviews-content.component.scss'],
})

export class ReviewsContentComponent implements OnInit {

  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef<HTMLInputElement>
  authReplies: any
  clearIcon = false
  disableLoadMore = false
  lookupLimit = 3
  lookupLoading: Boolean = true
  lastLookUp: any
  ratingReviews: any[] = []
  ratingLookup: any
  reviews: any[] = []

  constructor(
    public dialogRef: MatDialogRef<ReviewsContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ratingService: RatingService,
    private loggerService: LoggerService,
  ) { }

  ngOnInit() {
    this.reviews = Object.values(this.data.reviews)
  }

  handleCloseModal(): void {
    this.dialogRef.close()
  }

  handleFocus(): void {
    this.searchInput.nativeElement.focus()
  }

  handleClear(): void {
    this.clearIcon = false
    this.searchInput.nativeElement.value = ''
  }

  handleCapitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  processRatingLookup(response: any) {
    if (response) {
      if (response && response.length < this.lookupLimit) {
        this.disableLoadMore = true
      } else {
        this.disableLoadMore = false
        this.lookupLoading = false
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
        return this.authReplies
      },
      (err: any) => {
        this.loggerService.error('USER RATING FETCH ERROR >', err)
      }
    )
  }

}
