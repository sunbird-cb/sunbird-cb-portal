import { Component, HostBinding, Input, OnInit } from '@angular/core'
import { WidgetBaseComponent, NsWidgetResolver } from '@sunbird-cb/resolver'
import { WidgetContentService } from '../../_services/widget-content.service'
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

  constructor(private contentSvc: WidgetContentService,) {
    super()
  }

  ngOnInit() {
    console.log('kp')
    console.log('widgetData', this.widgetData)

    this.contentSvc.getKarmaPoitns().subscribe((res: any) => {
      console.log(res)
      if (res && res.kpList && res.kpList.length > 0) {
        this.widgetData.data = res.kpList
        console.log('widgetData', this.widgetData)
      }
    })
  }

}
