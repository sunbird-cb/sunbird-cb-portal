import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DownloadAppComponent } from '../component/download-app/download-app.component'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { HttpClient } from '@angular/common/http'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { MultilingualTranslationsService } from '@sunbird-cb/utils/src/lib/services/multilingual-translations.service'

// tslint:disable-next-line:function-name
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http)
}

@NgModule({
  declarations: [DownloadAppComponent],
  imports: [
    CommonModule,
    TranslateModule.forChild({}),
  ],
  exports: [
    DownloadAppComponent,
  ],
})
export class SharedModule {
  constructor(protected translate: TranslateService, 
    private langtranslations: MultilingualTranslationsService) {
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
    // this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
    //   console.log('onLangChange', event)
    // })

    this.langtranslations.languageSelectedObservable.subscribe(() => {
      // console.log("daata -----------" , this.langtranslations.selectedLang)
      // console.log('data', data)
      if (localStorage.getItem('websiteLanguage')) {
        this.translate.setDefaultLang('en')
        const lang = localStorage.getItem('websiteLanguage')!
        this.translate.use(lang)
      }
    })
  }
}
