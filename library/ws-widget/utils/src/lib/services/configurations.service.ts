import { Injectable } from '@angular/core'
import { NSProfileDataV3 } from '@ws/app/src/lib/routes/profile-v3/models/profile-v3.models'
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs'
// import { environment } from '../../../../../../src/environments/environment'
import { NsPage } from '../resolvers/page.model'
import { NsAppsConfig, NsInstanceConfig, NsUser } from './configurations.model'
import { IPortalUrls, IUserPreference } from './user-preference.model'

// const instanceConfigPath: string | null = window.location.host
// const locationHost: string | null = window.location.host

// if (!environment.production && Boolean(environment.sitePath)) {
//   locationHost = environment.sitePath
//   instanceConfigPath = environment.sitePath
// }
@Injectable({
  providedIn: 'root',
})
export class ConfigurationsService {
  // update as the single source of truth
  constructor() {
    // @Inject('env') env: any
    // if (!env.production && Boolean(env.sitePath)) {
    //   locationHost = env.sitePath
    //   instanceConfigPath = env.sitePath
    // }
  }
  appSetup = true
  // The url the user tried to access while landing in the app before accepting tnc
  userUrl = ''
  baseUrl = `assets/configurations`
  sitePath = `assets/configurations`
  hostPath = (window.location.host).replace(':', '_')

  userRoles: Set<string> | null = null
  userGroups: Set<string> | null = null
  restrictedFeatures: Set<string> | null = null
  restrictedWidgets: Set<string> | null = null
  instanceConfig: NsInstanceConfig.IConfig | null = null
  appsConfig: NsAppsConfig.IAppsConfig | null = null
  rootOrg: string | null = null
  courseContentPath?: string
  org: string[] | null = null
  activeOrg: string | null = ''
  isProduction = false
  hasAcceptedTnc = false
  profileDetailsStatus = false
  isActive = true
  userPreference: IUserPreference | null = null
  userProfile: NsUser.IUserProfile | null = null
  userProfileV2: NsUser.IUserProfile | null = null
  nodebbUserProfile: NsUser.INodebbUserProfile | null = null
  // created to store complete user details sent by pid
  unMappedUser: any
  isAuthenticated = false
  isNewUser = false
  portalUrls: IPortalUrls | undefined
  positions: any
  newJanChanges:any
  newJanMobChanges:any
  republicDay2024: any

  // pinnedApps
  pinnedApps = new BehaviorSubject<Set<string>>(new Set())

  // Notifier
  prefChangeNotifier = new ReplaySubject<Partial<IUserPreference>>(1)
  tourGuideNotifier = new ReplaySubject<boolean>()
  authChangeNotifier = new ReplaySubject<boolean>(1)

  private updateProfile = new BehaviorSubject(false)
  updateProfileObservable = this.updateProfile.asObservable()

  updateTourGuide = new BehaviorSubject(true)
  updateTourGuideObservable = this.updateTourGuide.asObservable()

  // platform rating
  updatePlatformRating = new BehaviorSubject({ bottom: '120px' })
  updatePlatformRatingObservable$ = this.updatePlatformRating.asObservable()

  // Preference Related Values
  activeThemeObject: NsInstanceConfig.ITheme | null = null
  activeFontObject: NsInstanceConfig.IFontSize | null = null
  isDarkMode = false
  isIntranetAllowed = false
  isRTL = false
  activeLocale: NsInstanceConfig.ILocalsConfig | null = null
  activeLocaleGroup = ''
  completedActivity: string[] | null = null
  completedTour = false
  profileSettings = ['profilePicture', 'learningTime', 'learningPoints']

  primaryNavBar: Partial<NsPage.INavBackground> = {
    color: 'primary',
  }
  pageNavBar: Partial<NsPage.INavBackground> = {
    color: 'primary',
  }
  primaryNavBarConfig: NsInstanceConfig.IPrimaryNavbarConfig | null = null
  /* for temp Fix */
  // setBaseUrl = (sitePath: string) => `assets/configurations/${(sitePath).replace(':', '_')}`
  // setSitePath = (sitePath: string) => `assets/configurations/${(sitePath).replace(
  //   ':',
  //   '_',
  // )}`
  // setHostPath = (sitePath: string) => (sitePath).replace(':', '_')
  welcomeTabs: NSProfileDataV3.IProfileTab | null = null

  // variable setting for csJwtToken
  cstoken = ''

  changeNavBarFullView = new Subject()
  openExploreMenuForMWeb = new Subject()
  updateGlobalProfile(state: boolean) {
    this.updateProfile.next(state)
  }
  updateTourGuideMethod(state: boolean) {
    this.updateTourGuide.next(state)
  }

  updatePlatformRatingMethod(state: any) {
    this.updatePlatformRating.next(state)
  }
}
