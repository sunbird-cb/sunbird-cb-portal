import { Component, HostBinding, Input, OnInit } from '@angular/core'
import { WidgetBaseComponent, NsWidgetResolver } from '@sunbird-cb/resolver'
import { IProHobbies } from './profile-hobbies.model'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'ws-widget-profile-v2-hobbies',
  templateUrl: './profile-hobbies.component.html',
  styleUrls: ['./profile-hobbies.component.scss'],
  /* tslint:disable */
  host: { class: 'flex flex-1' },
  /* tslint:enable */
})

// developing for old skill+certifications
export class ProfileHobbiesComponent extends WidgetBaseComponent implements OnInit, NsWidgetResolver.IWidgetData<any> {
  @Input() widgetData!: IProHobbies
  @HostBinding('id')
  public id = 'profile-hobbies'
  ngOnInit(): void {
  }

  constructor(private translate: TranslateService){
    super()
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      let lang = localStorage.getItem('websiteLanguage')!

      this.translate.use(lang)
    }
  }

  translateTabName(menuName: string): string {
    const translationKey = 'profileV2Hobbies.' + menuName.replace(/\s/g, "")
    return this.translate.instant(translationKey);
  }

  getDefaultTranslate(menuName: string): string {
    const translationKey = 'profileV2Hobbies.' + menuName.replace(/\s/g, "")
    return this.translate.instant(translationKey);
  }

}
