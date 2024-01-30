import { Component, OnInit, AfterViewInit, ViewChild, Inject, ElementRef } from '@angular/core'
import { fromEvent } from 'rxjs'
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
// tslint:disable-next-line
import _ from 'lodash'

@Component({
  selector: 'ws-widget-reviews-content',
  templateUrl: './reviews-content.component.html',
  styleUrls: ['./reviews-content.component.scss'],
})

export class ReviewsContentComponent implements OnInit, AfterViewInit {

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
  showFilterIndicator = 'all'

  constructor(
    public dialogRef: MatDialogRef<ReviewsContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.reviews = Object.values(this.data.reviews)
  }

  ngAfterViewInit(): void {
    fromEvent(this.searchInput.nativeElement, 'keyup')
    .pipe(
        // get value
        map((event: any) => {
          return event.target.value.trim()
        }),
        // Time in milliseconds between key events
        debounceTime(150),
        // If previous query is different from current
        distinctUntilChanged(),
      )
      // subscription for response
      .subscribe((text: string) => {
        this.clearIcon = (text.length) ? true : false

        if (text) {
          this.reviews = Object.values(this.data.reviews).filter((_obj: any) => {
            return _obj.review.toLowerCase().includes(text.toLowerCase()) || _obj.firstName.toLowerCase().includes(text.toLowerCase())
          })
        } else {
          this.reviews = Object.values(this.data.reviews)
        }
      })
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
    this.reviews = Object.values(this.data.reviews)
  }

  handleCapitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  handleReviewsFilter(str: string): void {
    this.showFilterIndicator = str
  }

  // processRatingLookup(response: any) {
  //   if (response) {
  //     if (response && response.length < this.lookupLimit) {
  //       this.disableLoadMore = true
  //     } else {
  //       this.disableLoadMore = false
  //       this.lookupLoading = false
  //     }
  //     this.lastLookUp = response[response.length - 1]
  //     this.ratingReviews = this.ratingLookup
  //     this.authReplies = []
  //     this.authReplies = _.keyBy(this.ratingReviews, 'userId')
  //     const userIds = _.map(this.ratingReviews, 'userId')
  //     if (this.content && userIds) {
  //       this.getAuthorReply(this.content.identifier, this.content.primaryCategory, userIds)
  //     }
  //     this.ratingReviews = this.ratingReviews.slice()
  //   }
  // }

  // getAuthorReply(identifier: string, primaryCategory: NsContent.EPrimaryCategory, userIds: any[]) {
  //   const request = {
  //     request: {
  //         activityId: identifier,
  //         activityType: primaryCategory,
  //         userId: userIds,
  //     },
  //   }

  //   return this.ratingService.getRatingReply(request).subscribe(
  //     (res: any) => {
  //       if (res && res.result && res.result.content) {
  //         const ratingAuthReplay = res.result.content
  //         _.forEach(ratingAuthReplay, value => {
  //             if (this.authReplies[value.userId]) {
  //               this.authReplies[value.userId]['comment'] = value.comment
  //               this.authReplies[value.userId]['userId'] = value.userId
  //             }
  //         })
  //       }
  //       return this.authReplies
  //     },
  //     (err: any) => {
  //       this.loggerService.error('USER RATING FETCH ERROR >', err)
  //     }
  //   )
  // }

}
