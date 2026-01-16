import { APP_BASE_HREF } from '@angular/common'
// import { retry } from 'rxjs/operators'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { MatIconRegistry } from '@angular/material/icon'
import { DomSanitizer } from '@angular/platform-browser'
import { BtnSettingsService } from '@sunbird-cb/collection'
import {
  hasPermissions,
  hasUnitPermission,
  NsWidgetResolver,
  WidgetResolverService,
} from '@sunbird-cb/resolver'
import {
  // AuthKeycloakService,
  // AuthKeycloakService,
  ConfigurationsService,
  LoggerService,
  NsAppsConfig,
  NsInstanceConfig,
  // NsUser,
  UserPreferenceService,
  WidgetEnrollService,
} from '@sunbird-cb/utils-v2'
import { environment } from '../../environments/environment'
/* tslint:disable */
import _ from 'lodash'
import { map } from 'rxjs/operators'
import { v4 as uuid } from 'uuid'
// import { Subscription } from 'rxjs'
import { NSProfileDataV3 } from '@ws/app/src/lib/routes/profile-v3/models/profile-v3.models'
import { NPSGridService } from '@sunbird-cb/collection/src/lib/grid-layout/nps-grid.service'
import moment from 'moment'
import { TranslateService } from '@ngx-translate/core'
import { SbUiResolverService } from '@sunbird-cb/resolver-v2'
import { NetCoreService } from './netcore.service'
declare const smartech: any
// import { of } from 'rxjs'
/* tslint:enable */
// interface IDetailsResponse {
//   tncStatus: boolean
//   roles: string[]
//   group: string[]
//   profileDetailsStatus: boolean
//   isActive: boolean
// }

interface IFeaturePermissionConfigs {
  [id: string]: Omit<NsWidgetResolver.IPermissions, 'feature'>
}

const PROXY_CREATE_V8 = '/apis/proxies/v8'

const endpoint = {
  profilePid: '/apis/proxies/v8/api/user/v2/read',
  fetchProfileById: (id: string) => `/apis/proxies/v8/api/user/v2/read/${id}`,
  // profileV2: '/apis/protected/v8/user/profileRegistry/getUserRegistryById',
  // details: `/apis/protected/v8/user/details?ts=${Date.now()}`,
  CREATE_USER_API: `${PROXY_CREATE_V8}/discussion/user/v1/create`,
  FIRST_LOGIN_API: '/apis/proxies/v8/login/entry',
}

@Injectable({
  providedIn: 'root',
})
export class InitService {
  private baseUrl = this.configSvc.baseUrl
  updateProfileSubscription: any | null = null

  httpOptions = {
    headers: new HttpHeaders({
      wid: 'cc0c1749-4c47-49c8-9f46-2bbdd42ef877',
    }),
  }

  isAnonymousTelemetry = window.location.href.includes('/public/') || window.location.href.includes('&preview=true')
    || window.location.href.includes('/certs') || window.location.href.includes('/crp/')

  constructor(
    private logger: LoggerService,
    private configSvc: ConfigurationsService,
    // private authSvc: AuthKeycloakService,
    private widgetResolverService: WidgetResolverService,
    private sbUiResolverService: SbUiResolverService,
    private settingsSvc: BtnSettingsService,
    private userPreference: UserPreferenceService,
    private http: HttpClient,
    private npsSvc: NPSGridService,
    private translate: TranslateService,
    private enrollSvc: WidgetEnrollService,
    private netCoreService: NetCoreService,
    // private widgetContentSvc: WidgetContentService,

    @Inject(APP_BASE_HREF) private baseHref: string,
    // private router: Router,
    domSanitizer: DomSanitizer,
    iconRegistry: MatIconRegistry,
  ) {
    this.configSvc.isProduction = environment.production

    // Register pin icon for use in Knowledge Board
    // Usage: <mat-icon svgIcon="pin"></mat-icon>
    iconRegistry.addSvgIcon(
      'pin',
      domSanitizer.bypassSecurityTrustResourceUrl('fusion-assets/icons/pin.svg'),
    )
    iconRegistry.addSvgIcon(
      'facebook',
      domSanitizer.bypassSecurityTrustResourceUrl('fusion-assets/icons/facebook.svg'),
    )
    iconRegistry.addSvgIcon(
      'linked-in',
      domSanitizer.bypassSecurityTrustResourceUrl('fusion-assets/icons/linked-in.svg'),
    )
    iconRegistry.addSvgIcon(
      'twitter',
      domSanitizer.bypassSecurityTrustResourceUrl('fusion-assets/icons/twitter.svg'),
    )
    iconRegistry.addSvgIcon(
      'category_xs',
      domSanitizer.bypassSecurityTrustResourceUrl('fusion-assets/icons/category_xs.svg'),
    )
    iconRegistry.addSvgIcon(
      'category_m',
      domSanitizer.bypassSecurityTrustResourceUrl('fusion-assets/icons/category_m.svg'),
    )
    iconRegistry.addSvgIcon(
      'hubs',
      domSanitizer.bypassSecurityTrustResourceUrl('fusion-assets/icons/hubs.svg'),
    )
    iconRegistry.addSvgIcon(
      'verified',
      domSanitizer.bypassSecurityTrustResourceUrl('fusion-assets/icons/verified.svg'),
    )
    iconRegistry.addSvgIcon(
      'info-outline',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/icon-wrapper.svg'),
    )
    iconRegistry.addSvgIcon(
      'video-library',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/hubs/video-library.svg'),
    )
    iconRegistry.addSvgIcon(
      'school-search',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/hubs/school-grey.svg'),
    )
    iconRegistry.addSvgIcon(
      'calender-event',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/hubs/event-grey.svg'),
    )
    iconRegistry.addSvgIcon(
      'people-search',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/hubs/group-grey.svg'),
    )
    iconRegistry.addSvgIcon(
      'menu_book',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/hubs/knowledge-resources-grey.svg'),
    )
    iconRegistry.addSvgIcon(
      'diversity_3',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/hubs/Jan-karmayogi-grey.svg'),
    )
    iconRegistry.addSvgIcon(
      'handshake',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/hubs/handshake.svg'),
    )
    iconRegistry.addSvgIcon(
      'certificate',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/hubs/certificate.svg'),
    )
    iconRegistry.addSvgIcon(
      'download',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/download.svg'),
    )
    iconRegistry.addSvgIcon(
      'course-cataloguee',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/hubs/course-cataloguee.svg'),
    )
    iconRegistry.addSvgIcon(
      'chat',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/edit.svg'),
    )
    iconRegistry.addSvgIcon(
      'content-locked',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/content-locked.svg'),
    )
    iconRegistry.addSvgIcon(
      'approved-icon',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/approved.svg'),
    )
    ///
    // iconRegistry.addSvgIcon(
    //   'mdo',
    //   domSanitizer.bypassSecurityTrustResourceUrl('fusion-assets/icons/hubs.svg'),
    // )
    // iconRegistry.addSvgIcon(
    //   'spv',
    //   domSanitizer.bypassSecurityTrustResourceUrl('fusion-assets/icons/hubs.svg'),
    // )
    // iconRegistry.addSvgIcon(
    //   'cbc',
    //   domSanitizer.bypassSecurityTrustResourceUrl('fusion-assets/icons/hubs.svg'),
    // )
    // iconRegistry.addSvgIcon(
    //   'cbp',
    //   domSanitizer.bypassSecurityTrustResourceUrl('fusion-assets/icons/hubs.svg'),
    // )
  }

  get isAnonymousTelemetryRequired(): boolean {
    this.isAnonymousTelemetry = window.location.href.includes('/public/')
      || window.location.href.includes('&preview=true') || window.location.href.includes('/certs') || window.location.href.includes('/crp/')
    return this.isAnonymousTelemetry
  }

  async init() {
    if (this.updateProfileSubscription) {
      this.updateProfileSubscription.unsubscribe()
    }
    // to update the profile from user read api
    this.updateProfileSubscription = this.configSvc.updateProfileObservable.subscribe(async (value: boolean) => {
      if (value) {
        await this.fetchUserDetails()
      }
    })
    // this.logger.removeConsoleAccess()
    await this.fetchDefaultConfig()
    await this.profileNudgeConfig()
    await this.themeOverrideConfig()
    await this.netCoreConfig()

    // const authenticated = await this.authSvc.initAuth()
    // if (!authenticated) {
    //   this.settingsSvc.initializePrefChanges(environment.production)
    //   this.updateNavConfig()
    //   this.logger.info('Not Authenticated')
    //   return false
    // }
    // Invalid User
    try {
      const path = window.location.pathname
      const isPublic = window.location.href.includes('/public/')
        || window.location.href.includes('&preview=true') || window.location.href.includes('/certs') || window.location.href.includes('/crp/')
      this.setTelemetrySessionId()
      if (!path.startsWith('/public') && !isPublic) {
        await this.fetchStartUpDetails()
        await this.fetchUserEnrollDetails()
      } else if (path.includes('/public/welcome')) {
        await this.fetchStartUpDetails()
      } else if (window.location.href.includes('editMode=true') && window.location.href.includes('_rc')) {
        await this.fetchStartUpDetails()
      }

      // detail: depends only on userID
    } catch (e) {
      this.settingsSvc.initializePrefChanges(environment.production)
      this.updateNavConfig()
      this.isAnonymousTelemetry = true
      this.updateTelemetryConfig()
      this.logger.info('Not Authenticated')
      await this.initFeatured()
      // window.location.reload() // can do this
      return false

    }
    try {
      // this.logger.info('User Authenticated', authenticated)
      // const userPrefPromise = await this.userPreference.fetchUserPreference() // pref: depends on rootOrg
      // this.configSvc.userPreference = userPrefPromise
      // this.reloadAccordingToLocale()
      // if (this.configSvc.userPreference.pinnedApps) {
      //   const pinnedApps = this.configSvc.userPreference.pinnedApps.split(',')
      //   this.configSvc.pinnedApps.next(new Set(pinnedApps))
      // }
      // if (this.configSvc.userPreference.profileSettings) {
      //   this.configSvc.profileSettings = this.configSvc.userPreference.profileSettings
      // }
      // await this.fetchUserProfileV2()
      // await this.createUserInNodebb()
      await this.initFeatured()
    } catch (e) {
      this.logger.warn(
        'Initialization process encountered some error. Application may not work as expected',
        e,
      )
      this.settingsSvc.initializePrefChanges(environment.production)
    }
    this.updateNavConfig()
    // await this.widgetContentSvc
    //   .setS3ImageCookie()
    //   .toPromise()
    //   .catch(() => {
    //     // throw new DataResponseError('COOKIE_SET_FAILURE')
    //   })
    if (
      !(
        window.location.href.includes('/public/') ||
        window.location.href.includes('/crp/') ||
        window.location.href.includes('/certs') ||
        window.location.href.includes('/viewer')
      )
    ) {
      this.logFirstLogin()
    }
    return true
  }
  async initFeatured() {
    const appsConfigPromise = this.fetchAppsConfig()
    const instanceConfigPromise = this.fetchInstanceConfig() // config: depends only on details
    const widgetStatusPromise = this.fetchWidgetStatus() // widget: depends only on details & feature
    await this.fetchFeaturesStatus() // feature: depends only on details
    /**
     * Wait for the widgets and get the list of restricted widgets
     */
    const widgetConfig = await widgetStatusPromise
    this.processWidgetStatus(widgetConfig)
    this.widgetResolverService.initialize(
      this.configSvc.restrictedWidgets,
      this.configSvc.userRoles,
      this.configSvc.userGroups,
      this.configSvc.restrictedFeatures,
    )
    this.sbUiResolverService.initialize(
      this.configSvc.restrictedWidgets,
      this.configSvc.userRoles,
      this.configSvc.userGroups,
      this.configSvc.restrictedFeatures,
    )
    /**
     * Wait for the instance config and after that
     */
    await instanceConfigPromise
    this.updateTelemetryConfig()
    /*
     * Wait for the apps config and after that
     */
    const appsConfig = await appsConfigPromise
    this.configSvc.appsConfig = this.processAppsConfig(appsConfig)
    if (this.configSvc.instanceConfig) {
      this.configSvc.instanceConfig.featuredApps = this.configSvc.instanceConfig.featuredApps.filter(
        id => appsConfig.features[id],
      )
    }

    // Apply the settings using settingsService
    this.settingsSvc.initializePrefChanges(environment.production)
    this.userPreference.initialize()

    // lang selection
    if (this.configSvc.instanceConfig && this.configSvc.instanceConfig.isMultilingualEnabled) {
      if (this.configSvc.unMappedUser) {
        if (this.configSvc.unMappedUser.profileDetails
          && this.configSvc.unMappedUser.profileDetails.additionalProperties
          && this.configSvc.unMappedUser.profileDetails.additionalProperties.webPortalLang) {
          const lang = this.configSvc.unMappedUser.profileDetails.additionalProperties.webPortalLang
          this.translate.use(lang)
          localStorage.setItem('websiteLanguage', lang)
        } else {
          if (localStorage.getItem('websiteLanguage')) {
            let lang = JSON.stringify(localStorage.getItem('websiteLanguage'))
            lang = lang.replace(/\"/g, '')
            this.translate.use(lang)
          } else {
            this.translate.setDefaultLang('en')
            localStorage.setItem('websiteLanguage', 'en')
          }
        }
      } else if (localStorage.getItem('websiteLanguage')) {
        let lang = JSON.stringify(localStorage.getItem('websiteLanguage'))
        lang = lang.replace(/\"/g, '')
        this.translate.use(lang)
      } else {
        this.translate.setDefaultLang('en')
        localStorage.setItem('websiteLanguage', 'en')
      }
    } else {
      this.translate.setDefaultLang('en')
      localStorage.setItem('websiteLanguage', 'en')
    }
  }
  // private reloadAccordingToLocale() {
  //   if (window.location.origin.indexOf('http://localhost:') > -1) {
  //     return
  //   }
  //   let pathName = window.location.href.replace(window.location.origin, '')
  //   const runningAppLang = this.locale
  //   if (pathName.startsWith(`//${runningAppLang}//`)) {
  //     pathName = pathName.replace(`//${runningAppLang}//`, '/')
  //   }
  //   const instanceLocales = this.configSvc.instanceConfig && this.configSvc.instanceConfig.locals
  //   if (Array.isArray(instanceLocales) && instanceLocales.length) {
  //     const foundInLocales = instanceLocales.some(locale => {
  //       return locale.path !== runningAppLang
  //     })
  //     if (foundInLocales) {
  //       if (
  //         this.configSvc.userPreference &&
  //         this.configSvc.userPreference.selectedLocale &&
  //         runningAppLang !== this.configSvc.userPreference.selectedLocale
  //       ) {
  //         let languageToLoad = this.configSvc.userPreference.selectedLocale
  //         languageToLoad = `\\${languageToLoad}`
  //         if (this.configSvc.userPreference.selectedLocale === 'en') {
  //           languageToLoad = ''
  //         }
  //         location.assign(`${location.origin}${languageToLoad}${pathName}`)
  //       }
  //     }
  //   }
  // }

  private async fetchDefaultConfig(): Promise<NsInstanceConfig.IConfig> {
    const publicConfig: NsInstanceConfig.IConfig = await this.http
      .get<NsInstanceConfig.IConfig>(`${this.baseUrl}/host.config.json`)
      .toPromise()
    this.configSvc.instanceConfig = publicConfig
    this.configSvc.rootOrg = publicConfig.rootOrg
    this.configSvc.org = publicConfig.org
    // TODO: set one org as default org :: use user preference
    this.configSvc.activeOrg = publicConfig.org[0]
    this.configSvc.appSetup = publicConfig.appSetup
    this.configSvc.positions = publicConfig.positions
    this.configSvc.compentency = publicConfig.compentency
    return publicConfig
  }

  private async profileNudgeConfig(): Promise<NsInstanceConfig.IConfig> {
    const publicConfig: NsInstanceConfig.IConfig = await this.http
      .get<NsInstanceConfig.IConfig>(`${this.baseUrl}/profile-nudge.json`)
      .toPromise()
    this.configSvc.profileTimelyNudges = publicConfig.profileTimelyNudges
    return publicConfig
  }

  private async netCoreConfig(): Promise<NsInstanceConfig.IConfig> {
    // const publicConfig: any = await this.http
    //   .get<any>(`${this.baseUrl}/netcore.json`)
    //   .toPromise()
    let payload = {
      "request": {
        "type": "page",
        "subType": "netcore",
        "action": "page-configuration",
        "component": "portal", "rootOrgId": "*"
      }
    }
    const publicConfig: any = await this.netCoreService.netCoreConfigReadData(payload).toPromise()
    this.configSvc.netcoreConfig = publicConfig.netcoreConfig
    return publicConfig
  }





  private async fetchUserEnrollDetails(): Promise<NsInstanceConfig.IConfig> {
    const publicConfig: NsInstanceConfig.IConfig = await this.enrollSvc.fetchEnrollStats(this.configSvc.userProfile?.userId).toPromise().then((res: any) => {
      let userCourseEnrolmentInfo: any = {}
      let userExternalCourseEnrolmentInfo: any = {}
      if (res && res.result && res.result.userCourseEnrolmentInfo) {

        userCourseEnrolmentInfo = res.result.userCourseEnrolmentInfo
        userExternalCourseEnrolmentInfo = res.result.userExternalCourseEnrolmentInfo
        userCourseEnrolmentInfo['karmaPoints'] = userCourseEnrolmentInfo['karmaPoints'] + (userExternalCourseEnrolmentInfo['karmaPoints'] || 0)
        userCourseEnrolmentInfo['timeSpentOnCompletedCourses'] = userCourseEnrolmentInfo['timeSpentOnCompletedCourses'] + (userExternalCourseEnrolmentInfo['timeSpentOnCompletedCourses'] || 0)
        userCourseEnrolmentInfo['certificatesIssued'] = userCourseEnrolmentInfo['certificatesIssued'] + (userExternalCourseEnrolmentInfo['certificatesIssued'] || 0)
        userCourseEnrolmentInfo['coursesInProgress'] = userCourseEnrolmentInfo['coursesInProgress'] + (userExternalCourseEnrolmentInfo['coursesInProgress'] || 0)
        if (userCourseEnrolmentInfo.addinfo && Object.keys(userCourseEnrolmentInfo.addinfo).length > 0) {
          if (Object.keys(userExternalCourseEnrolmentInfo).length > 0
            && userExternalCourseEnrolmentInfo.addinfo
            && Object.keys(userExternalCourseEnrolmentInfo.addinfo).length > 0) {
            let addInfo = userExternalCourseEnrolmentInfo.addinfo
            userCourseEnrolmentInfo['addinfo']['claimedNonACBPCourseKarmaQuota'] = userCourseEnrolmentInfo['addinfo']['claimedNonACBPCourseKarmaQuota'] + (addInfo['claimedNonACBPCourseKarmaQuota'] || 0)
            // userCourseEnrolmentInfo['addinfo']['formattedMonth'] = userExternalCourseEnrolmentInfo['externalCourses']
          }
        }
        let enrolledCourseCount = userCourseEnrolmentInfo['coursesInProgress'] + userCourseEnrolmentInfo['certificatesIssued']
        const userData = {
          enrolledCourseCount,
          userCourseEnrolmentInfo
        }
        localStorage.removeItem('userEnrollmentCount')
        localStorage.setItem('userEnrollmentCount', JSON.stringify(userData))

      }

      if (this.configSvc.userProfile) {
        let userProfile = this.configSvc && this.configSvc.userProfile
        if (userProfile.rootOrgId) {
          this.netCoreService.getOrgReadData(userProfile.rootOrgId).subscribe((orgData) => {
            //console.log('orgData--', orgData)
            if (orgData && orgData['netcoreDisabled']) {

            } else {
              smartech('create', 'ADGMOT35CHFLVDHBJNIG50K968HALK3BMP0VCCVVE0PODR835I00', "tin")
              smartech('register', 'b632681d782c843e187fd5447c97ed4d')
              smartech('identify', '')
              smartech('dispatch', 1, {})
              if (this.configSvc.netcoreConfig && this.configSvc.netcoreConfig.netcoreWebConfig
                && this.configSvc.netcoreConfig.netcoreWebConfig.isActive
              ) {
                let netCoreUserSetupFlag: any = localStorage.getItem('netCoreUserSetup') ? localStorage.getItem('netCoreUserSetup') : ''
                if (netCoreUserSetupFlag === 'false' || netCoreUserSetupFlag === false || netCoreUserSetupFlag === '') {
                  this.netCoreUserLoginSetup()
                }
              }
            }
          })
        }

      }




      return res
    }).catch((_err: any) => {
      let userCourseEnrolmentInfo = {
        enrolledCourseCount: 0,
        karmaPoints: 0,
        timeSpentOnCompletedCourses: 0,
        certificatesIssued: 0,
        coursesInProgress: 0,
        addinfo: {}
      }
      localStorage.removeItem('userEnrollmentCount')
      localStorage.setItem('userEnrollmentCount', JSON.stringify(userCourseEnrolmentInfo))
    }) as NsInstanceConfig.IConfig || {}
    return publicConfig
  }

  private async themeOverrideConfig(): Promise<NsInstanceConfig.IConfig> {
    const publicConfig: NsInstanceConfig.IConfig = await this.http
      .get<NsInstanceConfig.IConfig>(`${this.baseUrl}/theme-override-config.json`)
      .toPromise()
    this.configSvc.overrideThemeChanges = publicConfig.overrideThemeChanges
    return publicConfig
  }

  get locale(): string {
    return this.baseHref && this.baseHref.replace(/\//g, '')
      ? this.baseHref.replace(/\//g, '')
      : 'en'
  }

  private async fetchAppsConfig(): Promise<NsAppsConfig.IAppsConfig> {
    const appsConfig = await this.http
      .get<NsAppsConfig.IAppsConfig>(`${this.baseUrl}/feature/apps.json`)
      .toPromise()
    return appsConfig
  }
  private async fetchWelcomeConfig(): Promise<NSProfileDataV3.IProfileTab> {
    const welcomeConfig = await this.http
      .get<NSProfileDataV3.IProfileTab>(`${this.baseUrl}/feature/profile-v3.json`)
      .toPromise()
    return welcomeConfig
  }
  private setTelemetrySessionId() {
    if (localStorage.getItem('telemetrySessionId')) {
      localStorage.removeItem('telemetrySessionId')
    }
    localStorage.setItem('telemetrySessionId', uuid())
  }

  private logFirstLogin() {
    if (!localStorage.getItem('firsLogin')) {
      this.http.get<any>(endpoint.FIRST_LOGIN_API).pipe(map((res: any) => {
        if (res && res.result) {
          localStorage.setItem('firsLogin', 'true')
        }
      })).toPromise()
    }
  }
  private async fetchStartUpDetails(): Promise<any> {
    // const userRoles: string[] = []
    let apiResponse: any
    if (this.configSvc.instanceConfig && !Boolean(this.configSvc.instanceConfig.disablePidCheck)) {
      let userPidProfile: any | null = null
      try {
        userPidProfile = await this.http
          .get<any>(endpoint.profilePid)
          .pipe(map((res: any) => {
            // const roles = _.map(_.get(res, 'result.response.roles'), 'role')
            // _.set(res, 'result.response.roles', roles)
            apiResponse = res
            return _.get(res, 'result.response')
          })).toPromise()
        if (userPidProfile && userPidProfile.roles && userPidProfile.roles.length > 0 &&
          this.hasRole(userPidProfile.roles)) {
          // if (userPidProfile.result.response.organisations.length > 0) {
          //   const organisationData = userPidProfile.result.response.organisations
          //   userRoles = (organisationData[0].roles.length > 0) ? organisationData[0].roles : []
          // }
          // if (localStorage.getItem('telemetrySessionId')) {
          //   localStorage.removeItem('telemetrySessionId')
          // }
          // localStorage.setItem('telemetrySessionId', uuid())
          this.setTelemetrySessionId()
          this.updateTelemetryConfig()
          this.configSvc.unMappedUser = userPidProfile
          const profileV2 = _.get(userPidProfile, 'profileDetails')
          this.configSvc.userProfile = {
            country: _.get(profileV2, 'personalDetails.countryCode') || null,
            email: _.get(profileV2, 'profileDetails.officialEmail') || userPidProfile.email,
            givenName: userPidProfile.firstName,
            userId: userPidProfile.userId,
            firstName: userPidProfile.firstName,
            lastName: userPidProfile.lastName,
            rootOrgId: userPidProfile.rootOrgId,
            rootOrgName: userPidProfile.channel,
            // tslint:disable-next-line: max-line-length
            // userName: `${userPidProfile.firstName ? userPidProfile.firstName : ' '}${userPidProfile.lastName ? userPidProfile.lastName : ' '}`,
            userName: userPidProfile.userName,
            profileImage: userPidProfile.thumbnail,
            departmentName: userPidProfile.channel,
            dealerCode: null,
            isManager: false,
            profileUpdateCompletion: _.get(userPidProfile, 'profileUpdateCompletion') || 0,
            profileImageUrl: _.get(userPidProfile, 'profileDetails.profileImageUrl') || '',
            professionalDetails: _.get(userPidProfile, 'profileDetails.professionalDetails') || [],
            userRootOrg: _.get(userPidProfile, 'rootOrg') || null
          }

          this.configSvc.userProfileV2 = {
            userId: _.get(profileV2, 'userId') || userPidProfile.userId,
            email: _.get(profileV2, 'personalDetails.officialEmail') || userPidProfile.email,
            firstName: _.get(profileV2, 'personalDetails.firstname') || userPidProfile.firstName,
            surName: _.get(profileV2, 'personalDetails.surname') || userPidProfile.lastName,
            middleName: _.get(profileV2, 'personalDetails.middlename') || '',
            departmentName: _.get(profileV2, 'employmentDetails.departmentName') || userPidProfile.channel,
            givenName: _.get(userPidProfile, 'userName'),
            // tslint:disable-next-line: max-line-length
            userName: `${_.get(profileV2, 'personalDetails.firstname') ? _.get(profileV2, 'personalDetails.firstname') : ''}${_.get(profileV2, 'personalDetails.surname') ? _.get(profileV2, 'personalDetails.surname') : ''}`,
            profileImage: _.get(profileV2, 'photo') || userPidProfile.thumbnail,
            profileImageUrl: _.get(userPidProfile, 'profileDetails.profileImageUrl') || '',
            dealerCode: null,
            isManager: false,
            competencies: _.get(profileV2, 'competencies') || [],
            desiredCompetencies: _.get(profileV2, 'desiredCompetencies') || [],
            systemTopics: _.get(profileV2, 'systemTopics') || [],
            desiredTopics: _.get(profileV2, 'desiredTopics') || [],
            userRoles: _.get(profileV2, 'userRoles') || [],
            webPortalLang: _.get(profileV2, 'additionalProperties.webPortalLang') || '',
          }

          if (!this.configSvc.nodebbUserProfile) {
            this.configSvc.nodebbUserProfile = {
              username: userPidProfile.userName,
              email: 'null',
            }
          }
          localStorage.setItem('login', 'true')
        } else {
          // this.authSvc.force_logout()
          // await this.http.get('/apis/reset').toPromise()
          if (apiResponse && apiResponse.redirectUrl) {
            window.location.href = apiResponse.redirectUrl
          } else {
            window.location.href = `${this.defaultRedirectUrl}apis/reset`
          }
          this.updateTelemetryConfig()
        }
        const details = {
          group: [],
          profileDetailsStatus: !!_.get(userPidProfile, 'profileDetails.mandatoryFieldsExists'),
          roles: (userPidProfile.roles || []).map((v: { toLowerCase: () => void }) => v.toLowerCase()),
          tncStatus: !userPidProfile.promptTnC,
          isActive: !!!userPidProfile.isDeleted,
        }
        this.configSvc.hasAcceptedTnc = details.tncStatus
        this.configSvc.profileDetailsStatus = details.profileDetailsStatus
        // this.configSvc.userRoles = new Set((userRoles || []).map(v => v.toLowerCase()))
        // const detailsV: IDetailsResponse = await this.http
        // .get<IDetailsResponse>(endpoint.details).pipe(retry(3))
        // .toPromise()
        this.configSvc.userGroups = new Set(details.group)
        this.configSvc.userRoles = new Set((details.roles || []).map((v: string) => v.toLowerCase()))
        this.configSvc.isActive = details.isActive
        this.configSvc.welcomeTabs = await this.fetchWelcomeConfig()

        // nps check
        if (localStorage.getItem('platformratingTime')) {
          const date = localStorage.getItem('platformratingTime') || ''
          const isNextDay = moment().subtract(24, 'hours').isBefore(moment(new Date(date)))
          if (isNextDay) {
            this.checkUserFeed()
          }
        } else {
          this.checkUserFeed()
        }
        return details
      } catch (e) {
        this.configSvc.userProfile = null
        this.updateTelemetryConfig()
        throw new Error('Invalid user')
      }
    } else {
      return { group: [], profileDetailsStatus: true, roles: new Set(['Public']), tncStatus: true, isActive: true }
      // const details: IDetailsResponse = await this.http
      //   .get<IDetailsResponse>(endpoint.details).pipe(retry(3))
      //   .toPromise()
      // this.configSvc.userGroups = new Set(details.group)
      // this.configSvc.userRoles = new Set((details.roles || []).map(v => v.toLowerCase()))
      // if (this.configSvc.userProfile && this.configSvc.userProfile.isManager) {
      //   this.configSvc.userRoles.add('is_manager')
    }
  }

  // This is a replication of fetchStartUpDetails() method
  // only change is calling the read api with userID
  // since Backend api is failing if we call the read api twice
  private async fetchUserDetails(): Promise<any> {
    if (this.configSvc.unMappedUser.id) {
      let userPidProfile: any | null = null
      try {
        userPidProfile = await this.http
          .get<any>(endpoint.fetchProfileById(this.configSvc.unMappedUser.id))
          .pipe(map((res: any) => {
            // const roles = _.map(_.get(res, 'result.response.roles'), 'role')
            // _.set(res, 'result.response.roles', roles)
            return _.get(res, 'result.response')
          })).toPromise()

        if (userPidProfile && userPidProfile.roles && userPidProfile.roles.length > 0 &&
          this.hasRole(userPidProfile.roles)) {
          // if (userPidProfile.result.response.organisations.length > 0) {
          //   const organisationData = userPidProfile.result.response.organisations
          //   userRoles = (organisationData[0].roles.length > 0) ? organisationData[0].roles : []
          // }
          // if (localStorage.getItem('telemetrySessionId')) {
          //   localStorage.removeItem('telemetrySessionId')
          // }
          // localStorage.setItem('telemetrySessionId', uuid())
          this.setTelemetrySessionId()
          // make the endpoint private for logged in user
          this.updateTelemetryConfig()
          this.configSvc.unMappedUser = userPidProfile
          const profileV2 = _.get(userPidProfile, 'profileDetails')
          this.configSvc.userProfile = {
            country: _.get(profileV2, 'personalDetails.countryCode') || null,
            email: _.get(profileV2, 'profileDetails.officialEmail') || userPidProfile.email,
            givenName: userPidProfile.firstName,
            userId: userPidProfile.userId,
            firstName: userPidProfile.firstName,
            lastName: userPidProfile.lastName,
            rootOrgId: userPidProfile.rootOrgId,
            rootOrgName: userPidProfile.channel,
            // tslint:disable-next-line: max-line-length
            // userName: `${userPidProfile.firstName ? userPidProfile.firstName : ' '}${userPidProfile.lastName ? userPidProfile.lastName : ' '}`,
            userName: userPidProfile.userName,
            profileImage: userPidProfile.thumbnail,
            departmentName: userPidProfile.channel,
            dealerCode: null,
            isManager: false,
            profileUpdateCompletion: _.get(userPidProfile, 'profileUpdateCompletion') || 0,
            profileImageUrl: _.get(userPidProfile, 'profileDetails.profileImageUrl') || '',
            professionalDetails: _.get(userPidProfile, 'profileDetails.professionalDetails') || [],
            userRootOrg: _.get(userPidProfile, 'rootOrg') || null
          }
          this.configSvc.userProfileV2 = {
            userId: _.get(profileV2, 'userId') || userPidProfile.userId,
            email: _.get(profileV2, 'personalDetails.officialEmail') || userPidProfile.email,
            firstName: _.get(profileV2, 'personalDetails.firstname') || userPidProfile.firstName,
            surName: _.get(profileV2, 'personalDetails.surname') || userPidProfile.lastName,
            middleName: _.get(profileV2, 'personalDetails.middlename') || '',
            departmentName: _.get(profileV2, 'employmentDetails.departmentName') || userPidProfile.channel,
            givenName: _.get(userPidProfile, 'userName'),
            // tslint:disable-next-line: max-line-length
            userName: `${_.get(profileV2, 'personalDetails.firstname') ? _.get(profileV2, 'personalDetails.firstname') : ''}${_.get(profileV2, 'personalDetails.surname') ? _.get(profileV2, 'personalDetails.surname') : ''}`,
            profileImage: _.get(profileV2, 'photo') || userPidProfile.thumbnail,
            dealerCode: null,
            isManager: false,
            competencies: _.get(profileV2, 'competencies') || [],
            desiredCompetencies: _.get(profileV2, 'desiredCompetencies') || [],
            systemTopics: _.get(profileV2, 'systemTopics') || [],
            desiredTopics: _.get(profileV2, 'desiredTopics') || [],
            userRoles: _.get(profileV2, 'userRoles') || [],
            webPortalLang: _.get(profileV2, 'additionalProperties.webPortalLang') || '',
          }

          if (!this.configSvc.nodebbUserProfile) {
            this.configSvc.nodebbUserProfile = {
              username: userPidProfile.userName,
              email: 'null',
            }
          }
          localStorage.setItem('login', 'true')
        } else {
          // this.authSvc.force_logout()
          window.location.href = `${this.defaultRedirectUrl}apis/reset`
          this.updateTelemetryConfig()
        }
        const details = {
          group: [],
          profileDetailsStatus: !!_.get(userPidProfile, 'profileDetails.mandatoryFieldsExists'),
          roles: (userPidProfile.roles || []).map((v: { toLowerCase: () => void }) => v.toLowerCase()),
          tncStatus: !userPidProfile.promptTnC,
          isActive: !!!userPidProfile.isDeleted,
        }
        this.configSvc.hasAcceptedTnc = details.tncStatus
        this.configSvc.profileDetailsStatus = details.profileDetailsStatus
        // this.configSvc.userRoles = new Set((userRoles || []).map(v => v.toLowerCase()))
        // const detailsV: IDetailsResponse = await this.http
        // .get<IDetailsResponse>(endpoint.details).pipe(retry(3))
        // .toPromise()
        this.configSvc.userGroups = new Set(details.group)
        this.configSvc.userRoles = new Set((details.roles || []).map((v: string) => v.toLowerCase()))
        this.configSvc.isActive = details.isActive
        return details
      } catch (e) {
        this.configSvc.userProfile = null
        this.updateTelemetryConfig()
        throw new Error('Invalid user')
      }
    } else {
      return { group: [], profileDetailsStatus: true, roles: new Set(['Public']), tncStatus: true, isActive: true }
      // const details: IDetailsResponse = await this.http
      //   .get<IDetailsResponse>(endpoint.details).pipe(retry(3))
      //   .toPromise()
      // this.configSvc.userGroups = new Set(details.group)
      // this.configSvc.userRoles = new Set((details.roles || []).map(v => v.toLowerCase()))
      // if (this.configSvc.userProfile && this.configSvc.userProfile.isManager) {
      //   this.configSvc.userRoles.add('is_manager')
    }

  }

  private async fetchInstanceConfig(): Promise<NsInstanceConfig.IConfig> {
    // TODO: use the rootOrg and org to fetch the instance
    const publicConfig = await this.http
      .get<NsInstanceConfig.IConfig>(`${this.configSvc.sitePath}/site.config.json`)
      .toPromise()
    if (publicConfig.npsCategory) {
      localStorage.setItem('npsCategory', publicConfig.npsCategory)
    }

    this.configSvc.instanceConfig = publicConfig
    this.configSvc.rootOrg = publicConfig.rootOrg
    this.configSvc.org = publicConfig.org
    this.configSvc.portalUrls = publicConfig.portalUrls
    this.configSvc.activeOrg = publicConfig.org[0]
    this.configSvc.positions = publicConfig.positions
    this.configSvc.completionSurvey = publicConfig.completionSurvey
    this.updateAppIndexMeta()
    this.updateTelemetryConfig()
    return publicConfig
  }

  // private async createUserInNodebb(): Promise<any> {
  //   if (this.configSvc.nodebbUserProfile) {
  //     return of()
  //   }
  //   const req = {
  //     request: {
  //       username: (this.configSvc.userProfile && this.configSvc.userProfile.userName) || '',
  //       identifier: (this.configSvc.userProfile && this.configSvc.userProfile.userId) || '',
  //       fullname: this.configSvc.userProfile ? `${this.configSvc.userProfile.firstName} ${this.configSvc.userProfile.lastName}` : '',
  //     },
  //   }
  //   let createUserRes: null

  //   try {
  //     createUserRes = await this.http
  //       .post<any>(endpoint.CREATE_USER_API, req)
  //       .toPromise()
  //   } catch (e) {
  //     this.configSvc.nodebbUserProfile = null
  //     throw new Error('Invalid user')
  //   }

  //   const nodebbUserData: any = _.get(createUserRes, 'result')
  //   if (createUserRes) {
  //     this.configSvc.nodebbUserProfile = {
  //       username: nodebbUserData.userName,
  //       email: 'null',
  //     }
  //   }
  // }

  private async fetchFeaturesStatus(): Promise<Set<string>> {
    // TODO: use the rootOrg and org to fetch the features
    const featureConfigs = await this.http
      .get<IFeaturePermissionConfigs>(`${this.baseUrl}/features.config.json`)
      .toPromise()
    this.configSvc.restrictedFeatures = new Set(
      Object.entries(featureConfigs)
        .filter(
          ([_k, v]) => !hasPermissions(v, this.configSvc.userRoles, this.configSvc.userGroups),
        )
        .map(([k]) => k),
    )
    return this.configSvc.restrictedFeatures
  }
  private async fetchWidgetStatus(): Promise<NsWidgetResolver.IRegistrationsPermissionConfig[]> {
    const widgetConfigs = await this.http
      .get<NsWidgetResolver.IRegistrationsPermissionConfig[]>(`${this.baseUrl}/widgets.config.json`)
      .toPromise()
    return widgetConfigs
  }

  private processWidgetStatus(widgetConfigs: NsWidgetResolver.IRegistrationsPermissionConfig[]) {
    this.configSvc.restrictedWidgets = new Set(
      widgetConfigs
        .filter(u =>
          hasPermissions(
            u.widgetPermission,
            this.configSvc.userRoles,
            this.configSvc.userGroups,
            this.configSvc.restrictedFeatures,
          ),
        )
        .map(u => WidgetResolverService.getWidgetKey(u)),
    )
    return this.configSvc.restrictedWidgets
  }

  private processAppsConfig(appsConfig: NsAppsConfig.IAppsConfig): NsAppsConfig.IAppsConfig {
    const tourGuide = appsConfig.tourGuide
    const features: { [id: string]: NsAppsConfig.IFeature } = Object.values(
      appsConfig.features,
      // tslint:disable-next-line: no-shadowed-variable
    ).reduce((map: { [id: string]: NsAppsConfig.IFeature }, feature: NsAppsConfig.IFeature) => {
      if (hasUnitPermission(feature.permission, this.configSvc.restrictedFeatures, true)) {
        map[feature.id] = feature
      }
      return map
      // tslint:disable-next-line: align
    }, {})
    const groups = appsConfig.groups
      .map((group: NsAppsConfig.IGroup) => ({
        ...group,
        featureIds: group.featureIds.filter(id => Boolean(features[id])),
      }))
      .filter(group => group.featureIds.length)
    return { features, groups, tourGuide }
  }
  private updateNavConfig() {
    if (this.configSvc.instanceConfig) {
      const background = this.configSvc.instanceConfig.backgrounds
      if (background.primaryNavBar) {
        this.configSvc.primaryNavBar = background.primaryNavBar
      }
      if (background.pageNavBar) {
        this.configSvc.pageNavBar = background.pageNavBar
      }
      if (this.configSvc.instanceConfig.primaryNavBarConfig) {
        this.configSvc.primaryNavBarConfig = this.configSvc.instanceConfig.primaryNavBarConfig
      }
    }
  }

  private updateTelemetryConfig() {
    if (this.configSvc.instanceConfig && this.configSvc.instanceConfig.telemetryConfig) {
      if (this.isAnonymousTelemetryRequired) {
        this.configSvc.instanceConfig.telemetryConfig.endpoint = this.configSvc.instanceConfig.telemetryConfig.publicEndpoint
      } else {
        this.configSvc.instanceConfig.telemetryConfig.endpoint = this.configSvc.instanceConfig.telemetryConfig.protectedEndpoint
      }
    }
  }

  private updateAppIndexMeta() {
    if (this.configSvc.instanceConfig) {
      document.title = this.configSvc.instanceConfig.details.appName
      try {
        if (this.configSvc.instanceConfig.indexHtmlMeta.description) {
          const manifestElem = document.getElementById('id-app-description')
          if (manifestElem) {
            // tslint:disable-next-line: semicolon // tslint:disable-next-line: whitespace
            ; (manifestElem as HTMLMetaElement).setAttribute(
              'content',
              this.configSvc.instanceConfig.indexHtmlMeta.description,
            )
          }
        }
        if (this.configSvc.instanceConfig.indexHtmlMeta.webmanifest) {
          const manifestElem = document.getElementById('id-app-webmanifest')
          if (manifestElem) {
            // tslint:disable-next-line: semicolon // tslint:disable-next-line: whitespace
            ; (manifestElem as HTMLLinkElement).setAttribute(
              'href',
              this.configSvc.instanceConfig.indexHtmlMeta.webmanifest,
            )
          }
        }
        if (this.configSvc.instanceConfig.indexHtmlMeta.pngIcon) {
          const pngIconElem = document.getElementById('id-app-fav-icon')
          if (pngIconElem) {
            // tslint:disable-next-line: semicolon // tslint:disable-next-line: whitespace
            ; (pngIconElem as HTMLLinkElement).href = this.configSvc.instanceConfig.indexHtmlMeta.pngIcon
          }
        }
        if (this.configSvc.instanceConfig.indexHtmlMeta.xIcon) {
          const xIconElem = document.getElementById('id-app-x-icon')
          if (xIconElem) {
            // tslint:disable-next-line: semicolon // tslint:disable-next-line: whitespace
            ; (xIconElem as HTMLLinkElement).href = this.configSvc.instanceConfig.indexHtmlMeta.xIcon
          }
        }
      } catch (error) {
        this.logger.error('Error updating index html meta >', error)
      }
    }
  }
  hasRole(role: string[]): boolean {
    let returnValue = false
    const rolesForCBP = environment.portalRoles
    role.forEach(v => {
      if ((rolesForCBP).includes(v)) {
        returnValue = true
      }
    })
    return returnValue
  }

  // for NPS user feed check
  private checkUserFeed() {
    const feedId: any = []
    this.npsSvc.getFeedStatus(this.configSvc.unMappedUser.id).subscribe((res: any) => {
      if (res.result.response.userFeed && res.result.response.userFeed.length > 0) {
        const feed = res.result.response.userFeed
        feed.forEach((item: any) => {
          if (item.category === 'NPS' && item && item.data && item.data.actionData && item.data.actionData.formId) {
            feedId.push(item.id)
            // console.log(feedId, "feed id items============")
            const currentTime = moment()
            localStorage.platformratingTime = currentTime
            localStorage.setItem('ratingformID', JSON.stringify(item.data.actionData.formId))
            localStorage.setItem('ratingfeedID', JSON.stringify(feedId))
          } else if (item.category === 'NPS2' && item && item.data && item.data.actionData && item.data.actionData.formId) {
            feedId.push(item.id)
            // console.log(feedId, "feed id items============")
            const currentTime = moment()
            localStorage.platformratingTime = currentTime
            localStorage.setItem('ratingformID', JSON.stringify(item.data.actionData.formId))
            localStorage.setItem('ratingfeedID', JSON.stringify(feedId))
          }
        })
      }
    })
    const checkSurvey = localStorage.getItem('surveyPopup')
    if (checkSurvey && checkSurvey === 'false') {
      localStorage.setItem('surveyPopup', 'false')
    } else {
      localStorage.setItem('surveyPopup', 'true')
    }
  }

  // get default url

  private get defaultRedirectUrl(): string {
    try {
      const baseUrl = document.baseURI
      return baseUrl || location.origin
    } catch (error) {
      return location.origin
    }
  }

  async netCoreUserLoginSetup() {
    /* tslint:disable */
    localStorage.setItem('netCoreUserSetup', 'true')
    console.log('this.configSvc.unMappedUser', this.configSvc.unMappedUser)
    let userEnrollmentCount: any = await localStorage.getItem('userEnrollmentCount')
    if (userEnrollmentCount) {
      userEnrollmentCount = JSON.parse(userEnrollmentCount)
    }
    /* tslint:disable */
    console.log('userEnrollmentCount', userEnrollmentCount)
    /* tslint:enable */
    const userInfoPayload: any = {}
    userInfoPayload['TOTAL_EXPERIENCE'] = ''
    if (this.configSvc && this.configSvc.unMappedUser && this.configSvc.unMappedUser.identifier) {
      userInfoPayload['pk^userid'] = this.configSvc.unMappedUser.identifier.trim().toLowerCase()
    }
    // if(userEnrollmentCount &&
    //   userEnrollmentCount['userCourseEnrolmentInfo'] &&
    //   userEnrollmentCount['userCourseEnrolmentInfo']['karmaPoints']) {
    //   userInfoPayload['NO_OF_KARMA_POINTS'] = userEnrollmentCount['userCourseEnrolmentInfo']['karmaPoints']
    // }
    if (this.configSvc && this.configSvc.unMappedUser
      && this.configSvc.unMappedUser.profileDetails
      && this.configSvc.unMappedUser.profileDetails.personalDetails
    ) {
      if (this.configSvc.unMappedUser.profileDetails.personalDetails.firstname) {
        userInfoPayload['FULL_NAME'] = this.toTitleCase(this.configSvc.unMappedUser.profileDetails.personalDetails.firstname.trim())
      }
      // if (this.configSvc.unMappedUser.profileDetails.personalDetails.gender) {
      //   userInfoPayload['GENDER'] = this.toTitleCase(this.configSvc.unMappedUser.profileDetails.personalDetails.gender.trim())
      // }

      if (this.configSvc.unMappedUser.profileDetails.personalDetails.domicileMedium) {
        userInfoPayload['MOTHER_TONGUE'] = this.toTitleCase(this.configSvc.unMappedUser.profileDetails.personalDetails.domicileMedium.trim())
      }

      if (this.configSvc.unMappedUser.profileDetails.personalDetails.primaryEmail) {
        userInfoPayload['email'] = this.configSvc.unMappedUser.profileDetails.personalDetails.primaryEmail.trim()
      }
      if (this.configSvc.unMappedUser.profileDetails.personalDetails.mobile) {
        userInfoPayload['mobile'] = this.configSvc.unMappedUser.profileDetails.personalDetails.mobile
      }
    }
    if (this.configSvc && this.configSvc.unMappedUser
      && this.configSvc.unMappedUser.profileDetails
    ) {
      if (this.configSvc.unMappedUser.profileDetails.profileStatus) {
        userInfoPayload['PROFILE_STATUS'] = this.configSvc.unMappedUser.profileDetails.profileStatus.trim()
      }
      // if (this.configSvc.unMappedUser.profileDetails.profileImageUrl) {
      //   userInfoPayload['PROFILE_PHOTO'] = this.configSvc.unMappedUser.profileDetails.profileImageUrl.trim()
      // }
    }

    if (this.configSvc && this.configSvc.unMappedUser
      && this.configSvc.unMappedUser.profileDetails
      && this.configSvc.unMappedUser.profileDetails.professionalDetails
      && this.configSvc.unMappedUser.profileDetails.professionalDetails[0]
    ) {
      if (this.configSvc.unMappedUser.profileDetails.professionalDetails[0].designation) {
        userInfoPayload['PROFILE_DESIGNATION'] = this.toTitleCase(this.configSvc.unMappedUser.profileDetails.professionalDetails[0].designation.trim())
      }
      if (this.configSvc.unMappedUser.profileDetails && this.configSvc.unMappedUser.profileDetails.employmentDetails && this.configSvc.unMappedUser.profileDetails.employmentDetails.departmentName) {
        userInfoPayload['ORGANISATION'] = this.toTitleCase(this.configSvc.unMappedUser.profileDetails.employmentDetails.departmentName.trim())
      }
      if (this.configSvc.unMappedUser.profileDetails.professionalDetails[0].group) {
        userInfoPayload['PROFILE_GROUP'] = this.toTitleCase(this.configSvc.unMappedUser.profileDetails.professionalDetails[0].group.trim())
      }
    }
    /* tslint:disable */
    console.log('userInfoPayload', userInfoPayload)
    if (this.configSvc.netcoreConfig && this.configSvc.netcoreConfig.netcoreWebConfig
      && this.configSvc.netcoreConfig.netcoreWebConfig.isActive) {
      this.netCoreService.netCoreUserLoginSetup(userInfoPayload)
    }

    if (this.configSvc.netcoreConfig && this.configSvc.netcoreConfig.netcoreWebConfig
      && this.configSvc.netcoreConfig.netcoreWebConfig.isActive
      && this.configSvc.netcoreConfig.netcoreWebConfig.events
      && this.configSvc.netcoreConfig.netcoreWebConfig.events.user_signin
      && this.configSvc.netcoreConfig.netcoreWebConfig.events.user_signin.isActive
    ) {
      this.netCoreService.trackEvent('user_signin', this.configSvc.unMappedUser.identifier.trim().toLowerCase())
    }

    // smartech('contact', '', {
    //   'pk^userid': this.configSvc.unMappedUser.identifier.trim().toLowerCase(),
    //   'FULL_NAME' : this.configSvc.unMappedUser.profileDetails.personalDetails.firstname.trim().toLowerCase(),
    //   'GENDER': this.configSvc.unMappedUser.profileDetails.personalDetails.gender.trim().toLowerCase(),
    //   'NO_OF_KARMA_POINTS': userEnrollmentCount['userCourseEnrolmentInfo']['karmaPoints'],
    //   'PROFILE_STATUS' : this.configSvc.unMappedUser.profileDetails.personalDetails.profileStatus.trim().toLowerCase(),
    //   'MOTHER_TONGUE': this.configSvc.unMappedUser.profileDetails.personalDetails.domicileMedium.trim().toLowerCase(),
    //   'TOTAL_EXPERIENCE' : 'NA',
    //   'PROFILE_DESIGNATION': this.configSvc.unMappedUser.profileDetails.professionalDetails.designation.trim().toLowerCase(),
    //   'ORGANISATION': this.configSvc.unMappedUser.profileDetails.professionalDetails.organisationType.trim().toLowerCase(),
    //   'PROFILE_PHOTO':this.configSvc.unMappedUser.profileDetails.personalDetails.profileImageUrl.trim().toLowerCase(),
    //   'PROFILE_GROUP': this.configSvc.unMappedUser.profileDetails.professionalDetails.group.trim().toLowerCase(),
    //   'EMAIL': this.configSvc.unMappedUser.profileDetails.personalDetails.primaryEmail.trim().toLowerCase(),
    //   'MOBILE': this.configSvc.unMappedUser.profileDetails.personalDetails.mobile.toString().trim().toLowerCase(),
    // })
  }

  toTitleCase(str: string): string {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }
}
