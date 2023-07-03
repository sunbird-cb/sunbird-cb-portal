import { Component, OnInit, Input } from '@angular/core'
import { RatingService } from '../_services/rating.service'

@Component({
  selector: 'ws-widget-card-rating-comment',
  templateUrl: './card-rating-comment.component.html',
  styleUrls: ['./card-rating-comment.component.scss'],
})
export class CardRatingCommentComponent implements OnInit {
  @Input() review: any | null = null
  @Input() contentid: any
  authorReply: any
  showauthreply = false
  constructor(
    private ratingService: RatingService,
  ) { }

  ngOnInit() {
    if (this.review && this.review.review !== null) {
      this.getAuthorReply(this.review)
    }
  }

  getAuthorReply(review: any) {
    const uID =  review.userId  ?  review.userId :  review.user_id
    const contentid = review.activityId ? review.activityId : this.contentid
    this.ratingService.getAuthorReply(contentid, uID).subscribe(
        (res: any) => {
          if (res.result.response && res.result.response.comment && res.result.response.comment !== null) {
            this.authorReply = res.result.response.comment
          }
    })
  }

  showAuthReply() {
    this.showauthreply = !this.showauthreply
  }

  getRatingIcon(ratingIndex: number, avg: number): 'star' | 'star_border' | 'star_half' {
    return this.ratingService.getRatingIcon(ratingIndex, avg)
  }

  getRatingIconClass(ratingIndex: number, avg: number): boolean {
    return this.ratingService.getRatingIconClass(ratingIndex, avg)
  }

  getFullName(review: any) {
    if (!review && !review.firstName) {
        return ''
    }
    return `${review.firstName}`
  }

}
