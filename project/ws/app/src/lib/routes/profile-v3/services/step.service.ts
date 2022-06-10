import { Injectable } from '@angular/core'
// tslint:disable-next-line
import _ from 'lodash'
import { BehaviorSubject } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class StepService {
    public currentStep = new BehaviorSubject<any>({})
    public allSteps = new BehaviorSubject<number>(1)
    public skiped = new BehaviorSubject<boolean>(false)
    constructor() {
    }
    // next(step: number) {
    //     this.currentStep.next(step)
    // }
    // previous(step: number) {
    //     this.currentStep.next(step)
    // }
}
