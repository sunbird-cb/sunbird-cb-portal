import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import _ from "lodash";
import { BehaviorSubject, Observable } from "rxjs";
import { NSProfileDataV3 } from "../models/profile-v3.models";

const API_END_POINTS = {
    getTopics: '/apis/protected/v8/catalog',
}
@Injectable({
    providedIn: 'root',
})
export class TopicService {
    private selectedTopics = new BehaviorSubject<NSProfileDataV3.ITopic[]>([])

    constructor(
        private http: HttpClient,
    ) {
    }
    loadTopics(): Observable<any> {
        return this.http.get<any>(API_END_POINTS.getTopics)
    }
    addTopics(topic: NSProfileDataV3.ITopic) {
        let topics = this.selectedTopics.value
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
        let topics = this.selectedTopics.value || []
        const index = _.findIndex(topics, { identifier: topic.identifier });
        topics.splice(index, 1)
        this.selectedTopics.next(topics)
    }
    get getCurrentSelectedTopics(): NSProfileDataV3.ITopic[] | [] {
        if (this.selectedTopics.value) {
            return this.selectedTopics.value
        }
        return []
    }
}