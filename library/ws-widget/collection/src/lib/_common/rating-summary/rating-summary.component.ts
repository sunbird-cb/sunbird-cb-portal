import { Component, OnInit, Input } from '@angular/core'
import { RatingService } from '../../_services/rating.service'

@Component({
  selector: 'ws-widget-rating-summary',
  templateUrl: './rating-summary.component.html',
  styleUrls: ['./rating-summary.component.scss'],
})
export class RatingSummaryComponent implements OnInit {
  @Input() ratingSummary: any | null = null

  constructor(
    private ratingService: RatingService
  ) { }

  ngOnInit() {
   if (this.ratingSummary && this.ratingSummary.breakDown) {
     this.ratingSummary.breakDown = this.ratingSummary.breakDown.reverse()
   }
  }

  getRatingIcon(ratingIndex: number, avg: number): 'star' | 'star_border' | 'star_half' {
    return this.ratingService.getRatingIcon(ratingIndex, avg)
  }

  getRatingIconClass(ratingIndex: number, avg: number): boolean {
    return this.ratingService.getRatingIconClass(ratingIndex, avg)
  }

}
