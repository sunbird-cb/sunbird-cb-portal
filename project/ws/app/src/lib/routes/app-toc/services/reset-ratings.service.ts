import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

@Injectable({ providedIn: 'root' })

export class ResetRatingsService {
  private ratingService$ = new Subject<boolean>()
  resetRatings$ = this.ratingService$.asObservable()

  setRatingServiceUpdate(value: boolean) {
    this.ratingService$.next(value)
  }
}
