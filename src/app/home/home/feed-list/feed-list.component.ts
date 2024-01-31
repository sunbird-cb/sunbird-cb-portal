import { Component, Input, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'ws-feed-list',
  templateUrl: './feed-list.component.html',
  styleUrls: ['./feed-list.component.scss'],
})
export class FeedListComponent implements OnInit {
  contentStripData = {}
  @Input() widgetData: any
  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    if (this.activatedRoute.snapshot.data.pageData && this.activatedRoute.snapshot.data.pageData.data) {
      this.contentStripData = this.activatedRoute.snapshot.data.pageData.data || []
    }
  }
}
