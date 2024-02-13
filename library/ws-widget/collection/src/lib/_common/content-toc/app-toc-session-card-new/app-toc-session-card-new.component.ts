import { animate, style, transition, trigger } from '@angular/animations'
import { Component, Input, OnInit } from '@angular/core'
import { NsContent } from '@sunbird-cb/utils/src/public-api'

@Component({
  selector: 'ws-widget-app-toc-session-card-new',
  templateUrl: './app-toc-session-card-new.component.html',
  styleUrls: ['./app-toc-session-card-new.component.scss'],
  animations: [
    trigger('panelInOut', [
        transition('void => *', [
            style({ transform: 'translateY(-10%)', opacity: '0' }),
            animate(250),
        ]),
        transition('* => void', [
            animate(200, style({ transform: 'translateY(-10%)', opacity: '0' })),
        ]),
    ])],
})
export class AppTocSessionCardNewComponent implements OnInit {
  @Input() session: any = null
  @Input() expandAll = false
  @Input() rootId!: string
  @Input() rootContentType!: string
  @Input() forPreview = false
  @Input() batchData!: any
  @Input() config!: string
  @Input() index!: number
  @Input() content: NsContent.IContent | null = null
  isEnabled = true
  isAllowed = true
  viewChildren = true
  resourceLink: any

  constructor() { }

  ngOnInit() {
  }
  raiseTelemetry() { }
  public progressColor(): string {
    return '#1D8923'
  }
  public progressColor2(): string {
    return '#f27d00'
  }
  get isCollection(): boolean {
    if (this.content) {
      return this.content.mimeType === NsContent.EMimeTypes.COLLECTION
    }
    return false
  }
  get isResource(): boolean {
    if (this.content) {
      return (
        this.content.primaryCategory === NsContent.EPrimaryCategory.OFFLINE_SESSION
      )
    }
    return false
  }
  get isModule(): boolean {
    if (this.content) {
      return this.content.primaryCategory === NsContent.EPrimaryCategory.MODULE
    }
    return false
  }
}
