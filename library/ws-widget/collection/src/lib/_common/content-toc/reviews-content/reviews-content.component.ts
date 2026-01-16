import { Component, OnInit, AfterViewInit, ViewChild, Inject, ElementRef, Output, EventEmitter } from '@angular/core'
import { fromEvent } from 'rxjs'
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators'
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog'
// tslint:disable-next-line
import _ from 'lodash'

import { ReviewComponentDataService } from '../content-services/review-component-data.service'

@Component({
  selector: 'ws-widget-reviews-content',
  templateUrl: './reviews-content.component.html',
  styleUrls: ['./reviews-content.component.scss'],
})

export class ReviewsContentComponent implements OnInit, AfterViewInit {

  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef<HTMLInputElement>
  @Output() initiateLoadMore = new EventEmitter()
  @Output() loadLatestReviews = new EventEmitter()
  clearIcon = false
  disableLoadMore = false
  reviews: any[] = []
  showFilterIndicator = 'Top'
  displayLoader = false

  constructor(
    public dialogRef: MatDialogRef<ReviewsContentComponent>,
    private reviewDataService: ReviewComponentDataService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.reviewDataService.getReviewData().subscribe((_review: any) => {
      this.reviews = _review
      this.data.reviews = _review
    })
  }

  ngOnInit() {
    if (this.data && this.data.reviews) {
      this.reviews = Object.values(this.data.reviews)
    }
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
          this.reviews = Object.values(this.reviews).filter((_obj: any) => {
            return _obj.review && _obj.review.toLowerCase().includes(text.toLowerCase())
            || _obj.firstName && _obj.firstName.toLowerCase().includes(text.toLowerCase())
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

  handleCapitalize(str: string, type?: string): string {

    let returnValue = ''
    if (str && type === 'name') {
      returnValue = str.split(' ').map(_str => {
        return _str.charAt(0).toUpperCase() + _str.slice(1)
      }).join(' ')
    } else {
      returnValue = str && (str.charAt(0).toUpperCase() + str.slice(1))
    }
    return returnValue
  }

  handleReviewsFilter(str: string): void {
    this.showFilterIndicator = str
    this.loadLatestReviews.emit(str)
    this.handleClear()
  }

  handleLoadMore(): void {
    this.displayLoader = true
    this.initiateLoadMore.emit(this.showFilterIndicator)
  }
}
