import { Component, OnInit, Input } from '@angular/core'
import { NsContent } from '@sunbird-cb/collection/src/public-api'

@Component({
  selector: 'ws-widget-toc-kpi-values',
  templateUrl: './toc-kpi-values.component.html',
  styleUrls: ['./toc-kpi-values.component.scss'],
})

export class TocKpiValuesComponent implements OnInit {

  @Input() tocStructure: any
  @Input() content: NsContent.IContent | null = null
  @Input() isMobile = false
  @Input() showInstructorLedMsg = false
  constructor() { }

  ngOnInit() {
  }

}
