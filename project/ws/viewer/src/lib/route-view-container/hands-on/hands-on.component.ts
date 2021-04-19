import { Component, Input } from '@angular/core'
import { NsContent } from '@sunbird-cb/collection'

@Component({
  selector: 'viewer-hands-on-container',
  templateUrl: './hands-on.component.html',
  styleUrls: ['./hands-on.component.scss'],
})
export class HandsOnComponent {
  @Input() isFetchingDataComplete = false
  @Input() isErrorOccured = false
  @Input() handsOnData: NsContent.IContent | null = null
  @Input() handsOnManifest: any
  @Input() forPreview = false
  constructor() {}
}
