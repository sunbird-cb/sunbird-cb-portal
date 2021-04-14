import { Component, HostBinding, Input, OnInit } from '@angular/core'
import { WidgetBaseComponent, NsWidgetResolver } from '@sunbird-cb/resolver'
import { IProCert } from './profile-cretifications-v2.model'

@Component({
  selector: 'ws-widget-profile-cretifications-v2',
  templateUrl: './profile-cretifications-v2.component.html',
  styleUrls: ['./profile-cretifications-v2.component.scss'],
  /* tslint:disable */
  host: { class: 'flex flex-1' },
  /* tslint:enable */
})

// developing for old skill+certifications
export class ProfileCretificationsV2Component extends WidgetBaseComponent implements OnInit, NsWidgetResolver.IWidgetData<any> {
  @Input() widgetData!: IProCert
  @HostBinding('id')
  public id = 'profile-cert-v2'
  ngOnInit(): void {
  }
  changeToDefaultImg($event: any) {
    $event.target.src = '/assets/instances/eagle/app_logos/default.png'
  }
}
