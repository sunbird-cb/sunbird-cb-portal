import { Component, OnInit, Input } from '@angular/core'
import { NsContent } from '../../_services/widget-content.model'

@Component({
  selector: 'ws-widget-display-content-type-icon',
  templateUrl: './display-content-type-icon.component.html',
  styleUrls: ['./display-content-type-icon.component.scss'],
})
export class DisplayContentTypeIconComponent implements OnInit {

  @Input() displayContentType?: NsContent.EDisplayContentTypes
  displayContentTypeEnum = NsContent.EDisplayContentTypes
  @Input() mimeType?: NsContent.EMimeTypes
  constructor() { }

  ngOnInit() {
    if (!this.mimeType) {
      this.displayContentType = NsContent.EDisplayContentTypes.DEFAULT
    }
    if (this.mimeType && !this.displayContentType) {
      switch (this.mimeType) {
        case NsContent.EMimeTypes.PDF:
          this.displayContentType = NsContent.EDisplayContentTypes.PDF
          break
        case NsContent.EMimeTypes.MP3:
        case NsContent.EMimeTypes.M4A:
          this.displayContentType = NsContent.EDisplayContentTypes.AUDIO
          break
        case NsContent.EMimeTypes.MP4:
          this.displayContentType = NsContent.EDisplayContentTypes.VIDEO
          break
        case NsContent.EMimeTypes.YOUTUBE:
          this.displayContentType = NsContent.EDisplayContentTypes.YOUTUBE
          break
        case NsContent.EMimeTypes.TEXT_WEB:
          this.displayContentType = NsContent.EDisplayContentTypes.LINK
          break
        case NsContent.EMimeTypes.PRACTICE_RESOURCE:
        case NsContent.EMimeTypes.APPLICATION_JSON:
        case NsContent.EMimeTypes.QUIZ:
          this.displayContentType = NsContent.EDisplayContentTypes.QUIZ
          break
        case NsContent.EMimeTypes.HTML:
        case NsContent.EMimeTypes.ZIP2:
        case NsContent.EMimeTypes.ZIP:
          this.displayContentType = NsContent.EDisplayContentTypes.LINK
          break
        case NsContent.EMimeTypes.COLLECTION_RESOURCE:
        case NsContent.EMimeTypes.COLLECTION:
          this.displayContentType = NsContent.EDisplayContentTypes.MODULE
          break
        default:
          this.displayContentType = NsContent.EDisplayContentTypes.DEFAULT
          break
      }
    }
  }

}
