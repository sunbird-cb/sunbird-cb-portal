import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
// tslint:disable-next-line
import _ from 'lodash'
import { BehaviorSubject, Observable } from 'rxjs'
import { NSProfileDataV3 } from '../models/profile-v3.models'

const API_END_POINTS = {
    getTopics: '/apis/protected/v8/catalog',
    addTopic: '/apis/proxies/v8/user/v1/extPatch',
}
@Injectable({
    providedIn: 'root',
})
export class TopicService {
    public systemTopics = new BehaviorSubject<NSProfileDataV3.ITopic[]>([])
    public desiredTopics = new BehaviorSubject<string[]>([])
    public autoSave = new BehaviorSubject<boolean>(false)
    constructor(
        private http: HttpClient, private snackBar: MatSnackBar) {
    }
    loadTopics(): Observable<any> {
        return this.http.get<any>(API_END_POINTS.getTopics)
    }
    addSystemTopics(topic: NSProfileDataV3.ITopic) {
        const topics = this.systemTopics.value
        topics.push(topic)
        this.systemTopics.next(topics)
    }
    addDesiredTopics(topic: string) {
        const topics = this.desiredTopics.value
        const lowerTopics = topics.map(val => val.toLowerCase())
        const lowercaseTopic = topic.toLowerCase()
        const index = _.indexOf(lowerTopics, lowercaseTopic)
        if (index === -1) {
            topics.push(topic)
            this.snackBar.open('Added successfully!')
            this.desiredTopics.next(topics)
        } else {
            this.snackBar.open('Alredy exist!')
        }

    }
    /**
     * this method will fill all already added topics from users Profile.
     * @param topics
     */
    addInitSystemTopics(topics: NSProfileDataV3.ITopic[]) {
        this.systemTopics.next(topics)
    }
    addInitDesiredTopics(topics: string[]) {
        this.desiredTopics.next(topics)
    }
    removeSystemTopics(topic: NSProfileDataV3.ITopic) {
        const topics = this.systemTopics.value || []
        if (topic.identifier) {
            const index = _.findIndex(topics, { identifier: topic.identifier })
            if (index !== -1) {
                topics.splice(index, 1)
            }
        }
        this.systemTopics.next(topics)
    }
    removeDesiredTopics(topic: string) {
        const topics = this.desiredTopics.value || []
        const index = _.indexOf(topics, topic)
        if (index !== -1) {
            topics.splice(index, 1)
            this.desiredTopics.next(topics)
            this.snackBar.open('Removed successfully!')
        }
    }
    // removeDesiredTopics(topic: string) {
    //     const topics = this.desiredTopics.value || []
    //     if (topic) {
    //         const index = _.findIndex(topics,'Added by you')
    //         const cIdx = _.indexOf(topics, topic)
    //         topics[index].children.splice(cIdx, 1)
    //     }
    //     this.selectedTopics.next(topics)
    // }
    // addTopicsAddedByYou(topic: string) {
    //     const topics = this.selectedTopics.value || []
    //     if (topic) {
    //         const index = _.findIndex(topics, { name: 'Added by you' })
    //         topics[index].children.push(topic)
    //     }
    //     this.selectedTopics.next(topics)
    // }
    get getCurrentSelectedDesTopics(): string[] | [] {
        if (this.desiredTopics.value) {
            return this.desiredTopics.value
        }
        return []
    }
    get getCurrentSelectedSysTopics(): NSProfileDataV3.ITopic[] | [] {
        if (this.systemTopics.value) {
            return this.systemTopics.value
        }
        return []
    }
    saveDesiredTopic(data: NSProfileDataV3.IDesiredTopic) {
        return this.http.post<any>(API_END_POINTS.addTopic, data)
    }
    saveSystemTopic(data: NSProfileDataV3.ISystemTopic) {
        return this.http.post<any>(API_END_POINTS.addTopic, data)
    }
}
