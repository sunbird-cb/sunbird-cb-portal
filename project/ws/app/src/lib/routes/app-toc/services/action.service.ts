import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ActionService {
    private resumeL = new BehaviorSubject<any>('')

    constructor() {}

    public get getUpdateCompGroupO() {
        return this.resumeL.asObservable()
    }
    public set setUpdateCompGroupO(url: any) {
        this.resumeL.next(url)
    }
//   public getUpdateCompGroupById(locallId: number) {
//     return .first(.filter(this.finalCompDetail.value, { localId: locallId }))
//   }
}
