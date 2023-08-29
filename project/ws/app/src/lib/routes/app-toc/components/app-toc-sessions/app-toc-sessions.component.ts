import { Component, Input, OnInit } from '@angular/core'
import { NsContent } from '@sunbird-cb/collection'

@Component({
  selector: 'ws-app-app-toc-sessions',
  templateUrl: './app-toc-sessions.component.html',
  styleUrls: ['./app-toc-sessions.component.scss'],
})
export class AppTocSessionsComponent implements OnInit {
  @Input() batchData: any
  @Input() content: NsContent.IContent | null = null
  @Input() forPreview = false

  constructor() { }

  ngOnInit() {
  }

}
