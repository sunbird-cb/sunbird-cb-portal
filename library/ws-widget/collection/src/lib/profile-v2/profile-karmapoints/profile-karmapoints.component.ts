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

  constructor(
    private contentSvc: WidgetContentService,
  ) {
    super()
  }

  ngOnInit() {
    console.log('kp')
    this.contentSvc.getKarmaPoitns().subscribe((res: any) => {
      console.log(res)
    })

  }

}
