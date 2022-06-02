import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ws-app-topic-card',
  templateUrl: './topic-card.component.html',
  styleUrls: ['./topic-card.component.scss']
})
export class TopicCardComponent implements OnInit {

  topicData = [
    {
      id: 1,
      name: 'E-Governance & Information & Communication Technology',
      subTopic: ['Network & Communications', 'Database Managemewnt System - MS Access', 'Word Processing (MS-Word)', 'Presentation (MS-Powerpoint)']
    },
    {
      id: 2,
      name: 'Economics',
      subTopic: ['Growth Economics', 'Economics Thought', 'Principles of Macro Economics', 'Introduction to Economics']
    },
    {
      id: 3,
      name: 'History',
      subTopic: ['Ancient History', 'Medival History', 'Post-Independence History']
    },
    {
      id: 4,
      name: 'Information & Communication Technology and Digital Governance',
      subTopic: ['Computer fundamentals', 'Standalone Office Applications', 'Collaboration Tools and Meeting Solutions']
    }
  ]

  constructor() { }

  ngOnInit() {
  }

}
