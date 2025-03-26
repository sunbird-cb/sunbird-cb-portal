import { Injectable } from '@angular/core'
import { Observable, Subject } from 'rxjs'

@Injectable({ providedIn: 'root' })

export class HandleClaimService {
    constructor() { }
    private eventData$ = new Subject<any>()

    public getClaimData(): Observable<any> {
        return this.eventData$.asObservable()
    }

    public setClaimData(reviewData: any) {
        this.eventData$.next(reviewData)
    }
}
