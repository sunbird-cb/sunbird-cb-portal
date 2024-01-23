import { Component, OnInit } from '@angular/core'
// import { MatTabChangeEvent } from '@angular/material'

@Component({
  selector: 'ws-app-toc-about',
  templateUrl: './app-toc-about.component.html',
  styleUrls: ['./app-toc-about.component.scss'],
})

export class AppTocAboutComponent implements OnInit {

  constructor() { }
  descEllipsis = true
  summaryEllipsis = true
  competencySelected = 'behavioural'
  tags = ['Self-awareness', 'Awareness', 'Law', 'Design', 'Manager', 'Management', 'Designer', 'Product', 'Project Manager']

  ngOnInit() {
    const tags = ['Product management', 'Technology', 'Software', 'Artificial', 'Chatgpt', 'AI', 'Law rules']
    this.tags = [...this.tags, ...tags]
  }

  // handleTabChange(event: MatTabChangeEvent): void {}

}
