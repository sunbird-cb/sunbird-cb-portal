import { Component, HostBinding, Input, OnInit } from '@angular/core'
import { WidgetBaseComponent, NsWidgetResolver } from '@sunbird-cb/resolver'
@Component({
  selector: 'ws-widget-profile-v2-karmapoints',
  templateUrl: './profile-karmapoints.component.html',
  styleUrls: ['./profile-karmapoints.component.scss'],
  /* tslint:disable */
  host: { class: 'flex flex-1' },
  /* tslint:enable */
})
export class ProfileKarmapointsComponent extends WidgetBaseComponent implements OnInit, NsWidgetResolver.IWidgetData<any> {
  @Input() widgetData!: any
  @HostBinding('id')
  public id = 'profile-karmapoints'

  constructor() {
    super()
  }

  ngOnInit() {
  }

  getName(row: any) {
    const info = JSON.parse(row.addinfo)
    return info.COURSENAME ? info.COURSENAME : "No course"
  }
  getAdditonInfo(row: any) {
    const info = JSON.parse(row.addinfo)
    return info.ACBP
  }

}
