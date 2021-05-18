import { Component, HostBinding, Input, OnInit } from '@angular/core'
import { WidgetBaseComponent, NsWidgetResolver } from '@sunbird-cb/resolver'
import { IProfileAcademic } from './profile-academics.model'
@Component({
  selector: 'ws-widget-profile-v2-academics',
  templateUrl: './profile-academics.component.html',
  styleUrls: ['./profile-academics.component.scss'],
  /* tslint:disable */
  host: { class: 'flex flex-1' },
  /* tslint:enable */
})
export class ProfileAcademicsComponent extends WidgetBaseComponent implements OnInit, NsWidgetResolver.IWidgetData<any> {
  @Input() widgetData!: IProfileAcademic
  @HostBinding('id')
  public id = 'profile-academic'
  ngOnInit(): void {
  }

}
