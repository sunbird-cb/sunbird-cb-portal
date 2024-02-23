import { Component, OnInit, Input } from '@angular/core'
import { NsContent } from '../../_services/widget-content.model'
import { MultilingualTranslationsService } from '@sunbird-cb/utils/src/public-api'

@Component({
  selector: 'ws-widget-display-content-type',
  templateUrl: './display-content-type.component.html',
  styleUrls: ['./display-content-type.component.scss'],
})
export class DisplayContentTypeComponent implements OnInit {

  @Input() displayContentType: NsContent.EDisplayContentTypes = NsContent.EDisplayContentTypes.DEFAULT
  displayContentTypeEnum = NsContent.EDisplayContentTypes
  constructor(private langtranslations: MultilingualTranslationsService) { }

  ngOnInit() {
  }

  translateLabels(label: string, type: any) {
    return this.langtranslations.translateLabel(label, type, '')
  }
}
