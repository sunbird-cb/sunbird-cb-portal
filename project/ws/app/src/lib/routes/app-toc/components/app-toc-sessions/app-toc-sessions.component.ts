import { Component, Input, OnInit } from '@angular/core'
import { NsContent } from '@sunbird-cb/collection'
import moment from 'moment'

@Component({
  selector: 'ws-app-app-toc-sessions',
  templateUrl: './app-toc-sessions.component.html',
  styleUrls: ['./app-toc-sessions.component.scss'],
})
export class AppTocSessionsComponent implements OnInit {
  @Input() batchData: any
  @Input() content: NsContent.IContent | null = null
  @Input() forPreview = false
  @Input() config = null
  sessionList: any = []

  constructor() { }

  ngOnInit() {

    if (this.batchData) {
      // tslint:disable-next-line:max-line-length
      if (this.batchData.content[0] && this.batchData.content[0].batchAttributes && this.batchData.content[0].batchAttributes.sessionDetails_v2 && this.batchData.content[0].batchAttributes.sessionDetails_v2.length > 0) {
        this.sessionList = this.batchData.content[0].batchAttributes.sessionDetails_v2
        this.sessionList = this.sessionList.sort((a: any, b: any) => {
          const dateA: any = new Date(a.startDate)
          const dateB: any = new Date(b.startDate)
          if (moment(a.startDate).isSame(b.startDate)) {
            const atime: any = moment(a.startTime, 'hh:mm A').format('HH')
            const btime: any = moment(b.startTime, 'hh:mm A').format('HH')
            return atime - btime
          }
          return dateA - dateB
        })
      }
    }
  }
}
