import { Component, HostBinding, Input, OnInit } from '@angular/core'
import { WidgetBaseComponent, NsWidgetResolver } from '@sunbird-cb/resolver'
import { IProfileCareer } from './profile-career.model'
import moment from 'moment'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'ws-widget-profile-v2-career',
  templateUrl: './profile-career.component.html',
  styleUrls: ['./profile-career.component.scss'],
  /* tslint:disable */
  host: { class: 'flex flex-1' },
  /* tslint:enable */
})
export class ProfileCareerComponent extends WidgetBaseComponent implements OnInit, NsWidgetResolver.IWidgetData<any> {
  @Input() widgetData!: IProfileCareer
  @HostBinding('id')
  public id = 'profile-career'
  ngOnInit(): void {
  }
  paDate(date: any): string {
    const dat = moment(date, 'DD-MM-YYYY').toDate()
    return dat.toDateString()
  }
  constructor(
    private translate: TranslateService,
  ){
    super()
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      let lang = localStorage.getItem('websiteLanguage')!

      this.translate.use(lang)
    }
  }

  translateTabName(menuName: string): string {
    const translationKey = 'profileV2Career.' + menuName.replace(/\s/g, "")
    return this.translate.instant(translationKey);
  }

}
