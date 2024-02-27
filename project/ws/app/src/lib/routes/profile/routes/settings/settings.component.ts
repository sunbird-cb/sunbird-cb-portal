import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  ElementRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core'
import {
  NsInstanceConfig,
  ConfigurationsService,
  UserPreferenceService,
  UtilityService,
  MultilingualTranslationsService,
} from '@sunbird-cb/utils'
import { catchError, debounceTime, distinctUntilChanged, map } from 'rxjs/operators'
import { BtnSettingsService } from '@sunbird-cb/collection'
import { FormControl } from '@angular/forms'
import { Subscription, of } from 'rxjs'
import { Router, ActivatedRoute } from '@angular/router'
import { MatSnackBar, MatSelectChange, MatTabChangeEvent } from '@angular/material'
import { TranslateService } from '@ngx-translate/core'
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'ws-app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, OnDestroy {
  @ViewChild('successToast', { static: true }) successToast!: ElementRef<any>
  @ViewChild('failureToast', { static: true }) failureToast: ElementRef | null = null
  @ViewChild('maxContentLangToast', { static: true }) maxContentLangToast!: ElementRef<any>

  @Output() langChangedEvent = new EventEmitter<string>()
  @Input() mode: 'settings' | 'setup' = 'settings'

  themes: NsInstanceConfig.ITheme[] = []
  fonts: NsInstanceConfig.IFontSize[] = []
  allowedLangCode: { [langCode: string]: NsInstanceConfig.ILocalsConfig } = {}
  contentLangForm: FormControl = new FormControl()
  showContentLang = false
  intranetContentForm = new FormControl(false)
  darkModeForm = new FormControl(false)
  activeThemeKey = ''
  activeFontClass = ''
  activeLocaleClass = ''
  // Subscriptions
  modeChangeSubs: Subscription | null = null
  prefChangeSubs: Subscription | null = null
  appLanguage = ''
  chosenLanguage = ''
  contentLanguage: string[] = []
  selectedIndex: number | null = null
  isIntranetAllowed = true
  showIntranetSettings = false
  isLanguageEnabled = true
  // showProfileSettings = false
  selectedLanguage = 'en'
  multiLang: any = []
  isMultiLangEnabled: any
  defaultLang = [
    {
      value: 'English',
      key: 'en',
      checked : true,
    },
  ]

  constructor(
    // todo mobile settings removed
    private router: Router,
    private configSvc: ConfigurationsService,
    private btnSettingsSvc: BtnSettingsService,
    private userPrefSvc: UserPreferenceService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private utilitySvc: UtilityService,
    private langtranslations: MultilingualTranslationsService,
    private translate: TranslateService,
    private http: HttpClient,
  ) {
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
      this.selectedLanguage = lang
    }

    this.langtranslations.languageSelectedObservable.subscribe(() => {
      if (localStorage.getItem('websiteLanguage')) {
        this.translate.setDefaultLang('en')
        const lang = localStorage.getItem('websiteLanguage')!
        this.translate.use(lang)
        this.selectedLanguage = lang
      }
    })

    this.getHeaderFooterConfiguration().subscribe((sectionData: any) => {
      const topnavconfig = sectionData.data.topRightNavConfig
      topnavconfig.forEach((item: any) => {
        if (item.section === 'language') {
          this.isMultiLangEnabled = item.active
        }
      })
    })
  }

  ngOnInit() {
    const tab = this.route.snapshot.queryParamMap.get('tab')
    if (this.configSvc.restrictedFeatures) {
      this.showIntranetSettings =
        this.utilitySvc.isMobile && !this.configSvc.restrictedFeatures.has('showIntranetMobile')
      // this.showProfileSettings = !this.configSvc.restrictedFeatures.has('personProfile')
    }
    switch (tab) {
      case 'notifications':
        this.selectedIndex = 1
        break
      /*  case 'profile':
         this.selectedIndex = 2
         break */
      default:
        this.selectedIndex = 0
        break
    }
    this.initSettings()
  }

  private initSettings() {
    const instanceConfig = this.configSvc.instanceConfig
    this.isIntranetAllowed = !this.utilitySvc.isMobile

    if (this.configSvc.userPreference) {
      this.contentLanguage = (this.configSvc.userPreference.selectedLangGroup || '').split(',')
      this.contentLangForm.setValue(this.contentLanguage)
    }
    if (instanceConfig) {
      this.themes = instanceConfig.themes
      this.fonts = instanceConfig.fontSizes
      this.isLanguageEnabled = instanceConfig.locals.length > 1
      this.appLanguage = (this.configSvc.activeLocale && this.configSvc.activeLocale.path) || ''
      if (this.appLanguage === '') {
        this.appLanguage = 'en'
      }
      this.chosenLanguage = this.appLanguage
      this.fonts.sort((a, b) => a.scale - b.scale)

      this.multiLang = instanceConfig.webistelanguages
      // console.log('multilang', this.multiLang)

      this.allowedLangCode = instanceConfig.locals.reduce(
        (agg: { [path: string]: NsInstanceConfig.ILocalsConfig }, u) => {
          agg[u.path] = u
          return agg
        },
        {},
      )
      // Set the initial value for Themes
      this.darkModeForm.setValue(this.configSvc.isDarkMode)
      this.intranetContentForm.setValue(this.isIntranetAllowed)
      this.updateActiveStatus()
      // Events Subscription
      this.modeChangeSubs = this.darkModeForm.valueChanges
        .pipe(distinctUntilChanged(), debounceTime(150))
        .subscribe((isDark: boolean) => {
          this.btnSettingsSvc.applyThemeMode(isDark)
        })
      this.modeChangeSubs = this.intranetContentForm.valueChanges
        .pipe(distinctUntilChanged(), debounceTime(150))
        .subscribe((isIntranet: boolean) => {
          this.btnSettingsSvc.intranetContentMode(isIntranet)
        })
      this.prefChangeSubs = this.configSvc.prefChangeNotifier
        .pipe(debounceTime(100))
        .subscribe(() => {
          this.updateActiveStatus()
        })
    }
  }

  ngOnDestroy() {
    if (this.modeChangeSubs) {
      this.modeChangeSubs.unsubscribe()
    }
    if (this.prefChangeSubs) {
      this.prefChangeSubs.unsubscribe()
    }
  }

  isLocaleAvailable(langPath: string): boolean {
    // this.loggerSvc.log('Locale', this.allowedLangCode[langPath].isAvailable)
    return this.allowedLangCode[langPath] && this.allowedLangCode[langPath].isAvailable
  }
  isLocaleEnabled(langPath: string): boolean {
    return this.allowedLangCode[langPath] && this.allowedLangCode[langPath].isEnabled
  }

  isPrimary(langPath: string): boolean {
    return langPath === this.chosenLanguage
  }

  localeHrefPath(langPath: string): string | null {
    return this.allowedLangCode[langPath] &&
      this.allowedLangCode[langPath].isAvailable &&
      this.allowedLangCode[langPath].isEnabled
      ? langPath
      : null
  }

  localeIcon(langPath: string) {
    const currentLocalConfig = this.configSvc.activeLocale
    if (
      this.allowedLangCode[langPath] &&
      this.allowedLangCode[langPath].isEnabled &&
      currentLocalConfig
    ) {
      return currentLocalConfig && currentLocalConfig.path === langPath
        ? 'radio_button_checked'
        : 'radio_button_unchecked'
    }
    return 'not_interested'
  }

  // change font
  changeFont(fontClass: string) {
    localStorage.setItem('setting' , fontClass)
    // this.loggerSvc.log('Font', fontClass)
    this.btnSettingsSvc.changeFont(fontClass)
  }
  // Change theme
  changeTheme(themeKey: string) {
    // this.loggerSvc.log('theme', themeKey)
    this.btnSettingsSvc.changeTheme(themeKey)
  }

  private updateActiveStatus() {
    this.darkModeForm.setValue(this.configSvc.isDarkMode)
    this.intranetContentForm.setValue(this.configSvc.isIntranetAllowed)
    if (this.configSvc.activeThemeObject) {
      this.activeThemeKey = this.configSvc.activeThemeObject.themeClass
    }
    if (this.configSvc.activeFontObject) {
      this.activeFontClass = this.configSvc.activeFontObject.fontClass
    }
  }

  contentLangChanged() {
    if (this.contentLangForm.value.length < 4) {
      this.contentLanguage = this.contentLangForm.value
    } else {
      this.snackBar.open(this.maxContentLangToast.nativeElement.value, 'X')
      this.contentLangForm.setValue(this.contentLanguage)
    }
  }

  langChanged(path: MatSelectChange) {
    this.chosenLanguage = path.value
    this.langChangedEvent.emit(path.value)
  }

  applyChanges() {
    this.userPrefSvc
      .saveUserPreference({
        selectedLocale: this.chosenLanguage,
        selectedLangGroup: this.contentLanguage.join(','),
      })
      .then(() => {
        if (this.appLanguage !== this.chosenLanguage) {
          if (this.chosenLanguage === 'en') {
            this.chosenLanguage = ''
          }
          if (this.mode === 'settings') {
            location.assign(`${location.origin}/${this.chosenLanguage}${this.router.url}`)
          } else {
            location.assign(`${location.origin}/${this.chosenLanguage}/page/home`)
          }
        } else if (this.mode !== 'settings') {
          if (this.configSvc.userUrl) {
            this.router.navigateByUrl(this.configSvc.userUrl)
          } else {
            this.router.navigate(['page', 'home'])
          }
        }
        this.snackBar.open(this.successToast.nativeElement.value, 'X')
      })
  }

  updateCurrentTabIndex(changeEvent: MatTabChangeEvent) {
    this.selectedIndex = changeEvent.index
    let tab = 'general'
    switch (this.selectedIndex) {
      case 1:
        tab = 'notifications'
        break
      /*  case 2:
         tab = 'profile'
         break */
    }
    this.router.navigate([], { queryParams: { tab } })
  }

  selectLanguage(event: any) {
    // console.log('event', event)
    this.selectedLanguage = event
    localStorage.setItem('websiteLanguage', this.selectedLanguage)
    this.langtranslations.updatelanguageSelected(
      true,
      this.selectedLanguage,
      this.configSvc.unMappedUser ? this.configSvc.unMappedUser.id : ''
    )
  }

  getHeaderFooterConfiguration() {
    const baseUrl = this.configSvc.sitePath
    // tslint:disable-next-line: prefer-template
    return this.http.get(baseUrl + '/page/home.json').pipe(
      map(data => ({ data, error: null })),
      catchError(err => of({ data: null, error: err })),
    )
  }
}
