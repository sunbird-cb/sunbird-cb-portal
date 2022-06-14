import { Injectable } from '@angular/core'
// tslint:disable-next-line
import _ from 'lodash'
import { BehaviorSubject } from 'rxjs'
import { NSProfileDataV3 } from '../models/profile-v3.models'

@Injectable({
    providedIn: 'root',
})
export class CompLocalService {
    public currentComps = new BehaviorSubject<NSProfileDataV3.ICompetencie[]>([])
    public desiredComps = new BehaviorSubject<NSProfileDataV3.ICompetencie[]>([])
    public autoSaveCurrent = new BehaviorSubject<boolean>(false)
    public autoSaveDesired = new BehaviorSubject<boolean>(false)
    constructor() {
    }

    addcurrentComps(comp: NSProfileDataV3.ICompetencie) {
        const comps = this.currentComps.value
        comps.push(comp)
        this.currentComps.next(comps)
    }
    addDesiredComps(comp: NSProfileDataV3.ICompetencie) {
        const comps = this.desiredComps.value
        comps.push(comp)
        this.desiredComps.next(comps)
    }
    /**
     * this method will fill all already added Comps from users Profile.
     * @param Comps
     */
    addInitcurrentComps(comps: NSProfileDataV3.ICompetencie[]) {
        this.currentComps.next(comps)
    }
    addInitDesiredComps(comps: NSProfileDataV3.ICompetencie[]) {
        this.desiredComps.next(comps)
    }
    removecurrentComps(comp: NSProfileDataV3.ICompetencie) {
        const comps = this.currentComps.value || []
        if (comp.id) {
            const index = _.findIndex(comps, { id: comp.id })
            if (index !== -1) {
                comps.splice(index, 1)
            }
        }
        this.currentComps.next(comps)
    }
    removeDesiredComps(comp: NSProfileDataV3.ICompetencie) {
        const comps = this.desiredComps.value || []
        const index =  _.findIndex(comps, { id: comp.id })
        if (index !== -1) {
            comps.splice(index, 1)
            this.desiredComps.next(comps)
        }
    }
    get getCurrentSelectedDesComps(): NSProfileDataV3.ICompetencie[] | [] {
        if (this.desiredComps.value) {
            return this.desiredComps.value
        }
        return []
    }
    get getCurrentSelectedSysComps(): NSProfileDataV3.ICompetencie[] | [] {
        if (this.currentComps.value) {
            return this.currentComps.value
        }
        return []
    }

}
