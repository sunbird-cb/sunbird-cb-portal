import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class MultilingualTranslationsService {
    selectedLang: string = ''
    // website lang change
    languageSelected = new BehaviorSubject(true);
    languageSelectedObservable = this.languageSelected.asObservable();
  
    constructor(private translate: TranslateService) {
        if (localStorage.getItem('websiteLanguage')) {
            this.translate.setDefaultLang('en')
            let lang = localStorage.getItem('websiteLanguage')!
            this.translate.use(lang)
            console.log('-------------websiteLanguage--------------', localStorage.getItem('websiteLanguage'))
        }
    }

    translateLabel(label: string, type: any, subtype: any) {
        label = label.toLowerCase();
        const sl = label.split(' ')
        sl.forEach((w: any, index: any) => {
            if (index !== 0) {
                sl[index] = w[0].toUpperCase() + w.slice(1)
            }
        })
        label = sl.join('')
        label = label.replace(/\s/g, "")
        if(subtype) {
          const translationKey = type + '.' +  label + subtype
          return this.translate.instant(translationKey);
        } else {
            const translationKey = type + '.' +  label
            return this.translate.instant(translationKey);
        }
    }

    updatelanguageSelected(state: any, lang: any) {
        this.languageSelected.next(state)
        console.log('-------------websiteLanguage--------------', localStorage.getItem('websiteLanguage'))
        // if (localStorage.getItem('websiteLanguage')) {
        //   let lang = JSON.stringify(localStorage.getItem('websiteLanguage'))
        //   lang = lang.replace(/\"/g, "")
          this.translate.use(lang)
          this.selectedLang = lang
          console.log('-------------this.selectedLang--------------', this.selectedLang)
        // }
    }
}