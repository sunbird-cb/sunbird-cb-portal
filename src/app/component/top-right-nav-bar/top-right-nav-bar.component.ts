import { Component, Input, OnChanges, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material'
import { DialogBoxComponent } from './../dialog-box/dialog-box.component'
import { TranslateService } from '@ngx-translate/core'
import { HomePageService } from '../../services/home-page.service'
import { ConfigurationsService, MultilingualTranslationsService } from '@sunbird-cb/utils/src/public-api'
import { DomSanitizer } from '@angular/platform-browser'
import { HttpClient } from '@angular/common/http'
import { DialogBoxComponent as ZohoDialogComponent } from '@ws/app/src/lib/routes/profile-v3/components/dialog-box/dialog-box.component'
const rightNavConfig = [
  {
    id: 1,
    section: 'download',
    active: true,
  },
  {
    id: 2,
    section: 'font-setting',
    active: true,
  },
  {
    id: 3,
    section: 'help',
    active: true,
  },
  {
    id: 4,
    section: 'profile',
    active: true,
  },
]

@Component({
  selector: 'ws-top-right-nav-bar',
  templateUrl: './top-right-nav-bar.component.html',
  styleUrls: ['./top-right-nav-bar.component.scss'],
})
export class TopRightNavBarComponent implements OnInit, OnChanges {
  @Input() item: any
  @Input() rightNavConfig: any
  dialogRef: any
  selectedLanguage = 'en'
  multiLang: any = []
  zohoHtml: any
  zohoUrl: any = '/assets/static-data/zoho-code.html'
  isMultiLangEnabled: any

  constructor(public dialog: MatDialog, public homePageService: HomePageService,
              private configSvc: ConfigurationsService,
              private langtranslations: MultilingualTranslationsService, private translate: TranslateService,
              private http: HttpClient, private sanitizer: DomSanitizer) {
      if (localStorage.getItem('websiteLanguage')) {
        this.translate.setDefaultLang('en')
        let lang = JSON.stringify(localStorage.getItem('websiteLanguage'))
        lang = lang.replace(/\"/g, '')
        this.selectedLanguage = lang
        this.translate.use(lang)
      }

      this.langtranslations.languageSelectedObservable.subscribe(() => {
        if (localStorage.getItem('websiteLanguage')) {
          this.translate.setDefaultLang('en')
          const lang = localStorage.getItem('websiteLanguage')!
          this.translate.use(lang)
          this.selectedLanguage = lang
        }
      })
  }

  ngOnInit() {
    const instanceConfig = this.configSvc.instanceConfig
    if (instanceConfig) {
      this.multiLang = instanceConfig.websitelanguages
      this.isMultiLangEnabled = instanceConfig.isMultilingualEnabled
    }
    this.rightNavConfig = this.rightNavConfig.topRightNavConfig ? this.rightNavConfig.topRightNavConfig : rightNavConfig
    this.homePageService.closeDialogPop.subscribe((data: any) => {
      if (data) {
        this.dialogRef.close()
      }
    })

    this.http.get(this.zohoUrl, { responseType: 'text' }).subscribe(res => {
      this.zohoHtml = this.sanitizer.bypassSecurityTrustHtml(res)
    })
  }

  ngOnChanges() {
    this.rightNavConfig = this.rightNavConfig.topRightNavConfig ? this.rightNavConfig.topRightNavConfig : rightNavConfig
  }
  // ngOnChanges() {}
  // openDialog(): void {
  //   this.dialogRef = this.dialog.open(DialogBoxComponent, {
  //     width: '1000px',
  //   })
  translateLabels(label: string, type: any) {
    return this.langtranslations.translateLabel(label, type, '')
  }

  selectLanguage(event: any) {
    this.selectedLanguage = event
    localStorage.setItem('websiteLanguage', this.selectedLanguage)
    this.langtranslations.updatelanguageSelected(
      true,
      this.selectedLanguage,
      this.configSvc.unMappedUser ? this.configSvc.unMappedUser.id : ''
    )
    this.configSvc.languageTranslationFlag.next(true)
  }

  getZohoForm() {
    const dialogRef = this.dialog.open(ZohoDialogComponent, {
      width: '45%',
      data: {
        view: 'zohoform',
        value: this.zohoHtml,
      },
    })
    dialogRef.afterClosed().subscribe(() => {
    })
    setTimeout(() => {
      this.callXMLRequest()
    },         0)
  }

  openDialog(): void {
    this.dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '1000px',
    })

    this.dialogRef.afterClosed().subscribe(() => {
    })
  }

  callXMLRequest() {
    let webFormxhr: any = {}
    webFormxhr = new XMLHttpRequest()
    // tslint:disable-next-line: prefer-template
    webFormxhr.open('GET', 'https://desk.zoho.in/support/GenerateCaptcha?action=getNewCaptcha&_=' + new Date().getTime(), true)
    webFormxhr.onreadystatechange = () => {
      if (webFormxhr.readyState === 4 && webFormxhr.status === 200) {
        try {
          const response = (webFormxhr.responseText != null) ? JSON.parse(webFormxhr.responseText) : ''
          const zsCaptchaUrl: any = document.getElementById('zsCaptchaUrl')
          if (zsCaptchaUrl) {
            zsCaptchaUrl.src = response.captchaUrl
            zsCaptchaUrl.style.display = 'block'
          }
          const xJdfEaS: any = document.getElementsByName('xJdfEaS')[0]
          xJdfEaS.value = response.captchaDigest
          const zsCaptchaLoading: any = document.getElementById('zsCaptchaLoading')
          zsCaptchaLoading.style.display = 'none'
          const zsCaptcha: any = document.getElementById('zsCaptcha')
          zsCaptcha.style.display = 'block'
          const refreshCaptcha: any = document.getElementById('refreshCaptcha')
          if (refreshCaptcha) {
            refreshCaptcha.addEventListener('click', () => {
              this.callXMLRequest()
            })
          }
        } catch (e) {
        }
      }
    }
    webFormxhr.send()
  }
}
