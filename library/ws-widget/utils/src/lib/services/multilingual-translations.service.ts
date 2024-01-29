import { HttpClient } from "@angular/common/http";
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
    editProfileDetails = '/apis/proxies/v8/user/v1/extPatch'
  
    constructor(private translate: TranslateService, private http: HttpClient) {
        if (localStorage.getItem('websiteLanguage')) {
            this.translate.setDefaultLang('en')
            let lang = localStorage.getItem('websiteLanguage')!
            this.translate.use(lang)
        }
    }

    translateLabelWithoutspace(label: string, type: any, subtype: any) {
        label = label.replace(/\s/g, "")
        if(subtype) {
            const translationKey = type + '.' +  label + subtype
            return this.translate.instant(translationKey);
        }
        const translationKey = type + '.' +  label
        return this.translate.instant(translationKey);
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

    editProfileDetailsAPI(data: any) {
        return this.http.post<any>(this.editProfileDetails, data)
    }

    updatelanguageSelected(state: any, lang: any, userid: any) {
        this.languageSelected.next(state)
        this.translate.use(lang)
        this.selectedLang = lang

       if (userid) {
        let reqUpdates = {
            request: {
              userId: userid,
              profileDetails: {
                additionalProperties: {
                    webPortalLang: this.selectedLang
                }
              }
            }
        }
        this.editProfileDetailsAPI(reqUpdates).subscribe()
       }
    }
}