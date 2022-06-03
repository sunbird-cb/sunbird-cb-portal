import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
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
    public selectedTopics = new BehaviorSubject<NSProfileDataV3.ITopic[]>([])
    public autoSave = new BehaviorSubject<boolean>(false)
    constructor(
        private http: HttpClient) {
    }
    loadTopics(): Observable<any> {
        return this.http.get<any>(API_END_POINTS.getTopics)
    }
    addTopics(topic: NSProfileDataV3.ITopic) {
        const topics = this.selectedTopics.value
        topics.push(topic)
        this.selectedTopics.next(topics)
    }
    /**
     * this method will fill all already added topics from users Profile.
     * @param topics
     */
    addInitTopics(topics: NSProfileDataV3.ITopic[]) {
        this.selectedTopics.next(topics)
    }
    removeTopics(topic: NSProfileDataV3.ITopic) {
        const topics = this.selectedTopics.value || []
        if (topic.identifier) {
            const index = _.findIndex(topics, { identifier: topic.identifier })
            topics.splice(index, 1)
        }
        this.selectedTopics.next(topics)
    }
    removeTopicsAddedByYou(topic: string) {
        const topics = this.selectedTopics.value || []
        if (topic) {
            const index = _.findIndex(topics, { name: 'Added by you' })
            const cIdx = _.indexOf(topics[index].children, topic)
            topics[index].children.splice(cIdx, 1)
        }
        this.selectedTopics.next(topics)
    }
    addTopicsAddedByYou(topic: string) {
        const topics = this.selectedTopics.value || []
        if (topic) {
            const index = _.findIndex(topics, { name: 'Added by you' })
            topics[index].children.push(topic)
        }
        this.selectedTopics.next(topics)
    }
    get getCurrentSelectedTopics(): NSProfileDataV3.ITopic[] | [] {
        if (this.selectedTopics.value) {
            return this.selectedTopics.value
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
