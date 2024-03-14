import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { BehaviorSubject } from 'rxjs'
import { ConfigurationsService } from './configurations.service'

@Injectable({
    providedIn: 'root',
})

export class MultilingualTranslationsService {
    selectedLang = ''
    // website lang change
    languageSelected = new BehaviorSubject(true)
    languageSelectedObservable = this.languageSelected.asObservable()
    editProfileDetails = '/apis/proxies/v8/user/v1/extPatch'

    constructor(private translate: TranslateService, private http: HttpClient, private configSvc: ConfigurationsService) {
    //    this.getLanguage()
    }

    getLanguage() {
        if (this.configSvc.unMappedUser) {
            if (this.configSvc.unMappedUser.profileDetails &&
                this.configSvc.unMappedUser.profileDetails.additionalProperties &&
                this.configSvc.unMappedUser.profileDetails.additionalProperties.webPortalLang) {
              const lang = this.configSvc.unMappedUser.profileDetails.additionalProperties.webPortalLang
              this.translate.use(lang)
              localStorage.setItem('websiteLanguage', lang)
            } else {
              if (localStorage.getItem('websiteLanguage')) {
                // this.translate.setDefaultLang('en')
                let lang = JSON.stringify(localStorage.getItem('websiteLanguage'))
                lang = lang.replace(/\"/g, '')
                this.translate.use(lang)
              } else {
                this.translate.setDefaultLang('en')
                localStorage.setItem('websiteLanguage', 'en')
              }
            }
        } else {
            if (localStorage.getItem('websiteLanguage')) {
                // this.translate.setDefaultLang('en')
                let lang = JSON.stringify(localStorage.getItem('websiteLanguage'))
                lang = lang.replace(/\"/g, '')
                this.translate.use(lang)
            }
        }
    }

    translateLabelWithoutspace(label: string, type: any, subtype: any) {
        let nlabel = label
        nlabel = nlabel && nlabel.replace(/\s/g, '')
        if (subtype) {
            // tslint:disable-next-line: prefer-template
            const translationKey = type + '.' +  nlabel + subtype
            return this.translate.instant(translationKey)
        }
        // tslint:disable-next-line: prefer-template
        const translationKeyn = type + '.' +  nlabel
        return this.translate.instant(translationKeyn)
    }

    translateLabel(label: string, type: any, subtype: any) {
        let nlabel = label
        nlabel = nlabel.toLowerCase()
        const sl = nlabel.split(' ')
        sl.forEach((w: any, index: any) => {
            if (index !== 0) {
                sl[index] = w[0].toUpperCase() + w.slice(1)
            }
        })
        nlabel = sl.join('')
        nlabel = nlabel.replace(/\s/g, '')
        if (subtype) {
            // tslint:disable-next-line: prefer-template
          const translationKey = type + '.' +  nlabel + subtype
          return this.translate.instant(translationKey)
        }
        // tslint:disable-next-line: prefer-template
        const translationKeyn = type + '.' +  nlabel
        return this.translate.instant(translationKeyn)
    }

    translateActualLabel(label: string, type: any, subtype: any) {
        let nlabel = label
        const sl = nlabel.split(' ')
        sl.forEach((w: any, index: any) => {
            if (index !== 0) {
                sl[index] = w[0].toUpperCase() + w.slice(1)
            }
        })
        nlabel = sl.join('')
        nlabel = nlabel.replace(/\s/g, '')
        if (subtype) {
            // tslint:disable-next-line: prefer-template
          const translationKey = type + '.' +  nlabel + subtype
          return this.translate.instant(translationKey)
        }
        // tslint:disable-next-line: prefer-template
        const translationKeyn = type + '.' +  nlabel
        return this.translate.instant(translationKeyn)
    }

    editProfileDetailsAPI(data: any) {
        return this.http.post<any>(this.editProfileDetails, data)
    }

    updatelanguageSelected(state: any, lang: any, userid: any) {
        this.languageSelected.next(state)
        this.translate.use(lang)
        this.selectedLang = lang

       if (userid) {
        const reqUpdates = {
            request: {
              userId: userid,
              profileDetails: {
                additionalProperties: {
                    webPortalLang: this.selectedLang,
                },
              },
            },
        }
        this.editProfileDetailsAPI(reqUpdates).subscribe()
       }
    }
}
