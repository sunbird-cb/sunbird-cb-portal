import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root',
})

export class TimerService {
    private timer$ = new BehaviorSubject<any>({})

    constructor() {}

    public getTimerData() {
        return this.timer$.asObservable()
    }

    public setTimerData(timerObj: any) {
        this.timer$.next(timerObj);
    }
}