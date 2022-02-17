import { Injectable } from '@angular/core'
// import { Data } from '@angular/router'
import { BehaviorSubject } from 'rxjs'
import { NSBrowseCompetency } from '../models/competencies.model'
@Injectable({
    providedIn: 'root',
})
export class LocalDataService {
    compentecies: BehaviorSubject<NSBrowseCompetency.ICompetencie[] | []> = new BehaviorSubject<NSBrowseCompetency.ICompetencie[] | []>([])
    constructor() {
    }
    initData(data: NSBrowseCompetency.ICompetencie[]) {
        this.compentecies.next(data)
    }
}
