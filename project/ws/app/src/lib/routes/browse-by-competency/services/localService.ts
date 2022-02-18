import { Injectable } from '@angular/core'
// import { Data } from '@angular/router'
import { BehaviorSubject } from 'rxjs'
import { NSBrowseCompetency } from '../models/competencies.model'
@Injectable({
    providedIn: 'root',
})
export class LocalDataService {
    compentecies: BehaviorSubject<NSBrowseCompetency.ICompetencie[] | []> = new BehaviorSubject<NSBrowseCompetency.ICompetencie[] | []>([])
    providers: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([])

    constructor() {
    }
    initData(data: NSBrowseCompetency.ICompetencie[]) {
        this.compentecies.next(data)
    }
    initProviders(data: any) {
        this.providers.next(data)
    }
}
