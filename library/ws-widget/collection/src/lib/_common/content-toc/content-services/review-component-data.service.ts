import { Injectable } from '@angular/core'
import { Observable, Subject } from 'rxjs'

@Injectable({ providedIn: 'root' })

export class ReviewComponentDataService {
    constructor() { }
    private reviewData$ = new Subject<any>()

    public getReviewData(): Observable<any> {
        return this.reviewData$.asObservable()
    }

    public setReviewData(reviewData: any) {
        this.reviewData$.next(reviewData)
    }
}
