import { Component, OnInit, Input } from '@angular/core'
import { RatingService } from '../_services/rating.service'

@Component({
  selector: 'ws-widget-card-rating-comment',
  templateUrl: './card-rating-comment.component.html',
  styleUrls: ['./card-rating-comment.component.scss'],
})
export class CardRatingCommentComponent implements OnInit {
  @Input() review: any | null = null
  constructor(
    private ratingService: RatingService,
  ) { }

  ngOnInit() {
  }

  getRatingIcon(ratingIndex: number, avg: number): 'star' | 'star_border' | 'star_half' {
    return this.ratingService.getRatingIcon(ratingIndex, avg)
  }

  getRatingIconClass(ratingIndex: number, avg: number): boolean {
    return this.ratingService.getRatingIconClass(ratingIndex, avg)
  }

}
