import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NSProfileDataV3 } from '../../models/profile-v3.models';

@Component({
  selector: 'ws-app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss']
})
export class TopicComponent implements OnInit {

  topics!: NSProfileDataV3.ITopic[]
  constructor(private aRoute: ActivatedRoute) {
    this.loadTopics()
  }

  ngOnInit() {
  }
  loadTopics() {
    if (
      this.aRoute.snapshot.data
      && this.aRoute.snapshot.data.topics
      && this.aRoute.snapshot.data.topics.data
    ) {
      this.topics = this.aRoute.snapshot.data.topics.data
    }
  }

}
