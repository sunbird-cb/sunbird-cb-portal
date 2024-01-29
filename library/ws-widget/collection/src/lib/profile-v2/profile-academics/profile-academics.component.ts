import { Component, HostBinding, Input, OnInit } from '@angular/core'
import { WidgetBaseComponent, NsWidgetResolver } from '@sunbird-cb/resolver'
import { IProfileAcademic } from './profile-academics.model'
import { TranslateService } from '@ngx-translate/core'
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

  constructor(private translate: TranslateService
    ){
    super()
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      let lang = localStorage.getItem('websiteLanguage')!

      this.translate.use(lang)
    }
  }

  translateTabName(menuName: string): string {
    const translationKey = 'profileV2Academics.' + menuName.replace(/\s/g, "")
    return this.translate.instant(translationKey);
  }

  getDefaultTranslate(menuName: string): string {
    const translationKey = 'profileV2Academics.' + menuName.replace(/\s/g, "")
    return this.translate.instant(translationKey);
  }
}
