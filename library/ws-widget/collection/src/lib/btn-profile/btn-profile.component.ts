import { Component, Input, OnInit, OnDestroy, HostBinding } from '@angular/core'
import { NsWidgetResolver, WidgetBaseComponent } from '@sunbird-cb/resolver'
import { ConfigurationsService, LogoutComponent, NsPage, NsAppsConfig, EventService, WsEvents } from '@sunbird-cb/utils-v2'
import { IBtnAppsConfig } from '../btn-apps/btn-apps.model'
import { MatDialog } from '@angular/material'
import { Subscription } from 'rxjs'
import { ROOT_WIDGET_CONFIG } from '../collection.config'
/* tslint:disable*/
import _ from 'lodash'
import { AccessControlService } from '@ws/author/src/lib/modules/shared/services/access-control.service'
import { ActivatedRoute, Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
/* tslint:enable*/
interface IGroupWithFeatureWidgets extends NsAppsConfig.IGroup {
  featureWidgets: NsWidgetResolver.IRenderConfigWithTypedData<NsPage.INavLink>[]
}
@Component({
  selector: 'ws-widget-btn-profile',
  templateUrl: './btn-profile.component.html',
  styleUrls: ['./btn-profile.component.scss'],
})

export class BtnProfileComponent extends WidgetBaseComponent
  implements OnInit, OnDestroy, NsWidgetResolver.IWidgetData<NsPage.INavLink> {
  @HostBinding('id')
  public id = 'Profile_link'
  @Input() widgetData!: any
  @HostBinding('class')
  public class = 'profile-link'
  basicBtnAppsConfig: NsWidgetResolver.IRenderConfigWithTypedData<IBtnAppsConfig> = {
    widgetType: 'actionButton',
    widgetSubType: 'actionButtonApps',
    widgetData: { allListingUrl: '' },
  }
  settingBtnConfig: NsWidgetResolver.IRenderConfigWithTypedData<IBtnAppsConfig> = {
    widgetType: 'actionButton',
    widgetSubType: 'actionButtonSetting',
    widgetData: { allListingUrl: '' },
  }
  isPinFeatureAvailable = true
  pinnedApps: NsWidgetResolver.IRenderConfigWithTypedData<NsPage.INavLink>[] = []

  btnAppsConfig!: NsWidgetResolver.IRenderConfigWithTypedData<IBtnAppsConfig>
  btnSettingsConfig!: NsWidgetResolver.IRenderConfigWithTypedData<IBtnAppsConfig>
  private pinnedAppsSubs?: Subscription
  givenName = 'Guest'
  verifiedBadge = false
  profileImage!: string | null
  private readonly featuresConfig: IGroupWithFeatureWidgets[] = []
  portalLinks: any[] = []
  hideMenu = false
  constructor(
    private configSvc: ConfigurationsService,
    private dialog: MatDialog,
    private accessService: AccessControlService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private events: EventService
  ) {
    super()
    this.btnAppsConfig = { ...this.basicBtnAppsConfig }
    this.btnSettingsConfig = { ... this.settingBtnConfig }
    if (this.configSvc.unMappedUser && this.configSvc.unMappedUser.profileDetails &&
      this.configSvc.unMappedUser.profileDetails.profileStatus === 'VERIFIED') {
      this.verifiedBadge = true
    }
    this.updateUserInfo()
    if (this.configSvc.appsConfig) {
      const appsConfig = this.configSvc.appsConfig
      const availGroups: NsAppsConfig.IGroup[] = []
      appsConfig.groups.forEach((group: any) => {
        if (group.hasRole.length === 0 || this.accessService.hasRole(group.hasRole)) {
          availGroups.push(group)
        }
      })
      this.featuresConfig = availGroups.map(
        (group: NsAppsConfig.IGroup): IGroupWithFeatureWidgets => (
          {
            ...group,
            featureWidgets: _.compact(group.featureIds.map(
              (id: string): NsWidgetResolver.IRenderConfigWithTypedData<NsPage.INavLink> | undefined => {
                const permissions = _.get(appsConfig, `features[${id}].permission`)
                if (!permissions || permissions.length === 0 || this.accessService.hasRole(permissions)) {
                  return ({
                    widgetType: ROOT_WIDGET_CONFIG.actionButton._type,
                    widgetSubType: ROOT_WIDGET_CONFIG.actionButton.feature,
                    widgetHostClass: 'my-2 px-2 w-1/2 sm:w-1/3 md:w-1/6 w-lg-1-8 box-sizing-box',
                    widgetData: {
                      config: {
                        type: 'feature-item',
                        useShortName: false,
                        treatAsCard: true,
                      },
                      actionBtn: appsConfig.features[id],
                    },
                  })
                }
                return undefined
              },
            )),
          }),
      )
    }

    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
  }
  updateUserInfo() {
    if (this.configSvc.userProfile) {
      // tslint:disable-next-line:max-line-length
      if (this.configSvc.userProfile.lastName && this.configSvc.userProfile.lastName !== null && this.configSvc.userProfile.lastName !== undefined) {
        this.givenName = `${this.configSvc.userProfile.firstName} ${this.configSvc.userProfile.lastName}`
      } else {
        this.givenName = `${this.configSvc.userProfile.firstName}`
      }
      this.profileImage = this.configSvc.userProfile.profileImageUrl ||
        (this.configSvc.userProfileV2 ? this.configSvc.userProfileV2.profileImage : null) || null
      if (!this.profileImage && localStorage.getItem(this.configSvc.userProfile.userId)) {
        this.profileImage = localStorage.getItem(this.configSvc.userProfile.userId)
      }
    }
  }
  get getGivenName() {
    if (this.configSvc.userProfile) {
      // tslint:disable-next-line:max-line-length
      // if (this.configSvc.userProfile.lastName && this.configSvc.userProfile.lastName !== null && this.configSvc.userProfile.lastName !== undefined) {
      //   this.givenName = `${this.configSvc.userProfile.firstName} ${this.configSvc.userProfile.lastName}`
      // } else {
      //   this.givenName = `${this.configSvc.userProfile.firstName}`
      // }
      this.givenName = `${this.configSvc.userProfile.firstName}`
      return this.givenName
    }
    return 'Guest'
  }
  ngOnInit() {
    // this.configSvc.updateProfileObservable.subscribe(yes => {
    //   if (yes) {
    //     setTimeout(this.updateUserInfo.bind(this), 2000)
    //   }
    // })
    this.setPinnedApps()
    if (this.widgetData && this.widgetData.actionBtnId) {
      this.id = this.widgetData.actionBtnId
    }

    if (this.featuresConfig && this.featuresConfig.length > 0) {
      this.getPortalLinks()
    }
    let isNotMyUser = false
    let isIgotOrg = false
    if (this.configSvc && this.configSvc.unMappedUser
      && this.configSvc.unMappedUser.profileDetails
      && this.configSvc.unMappedUser.profileDetails.profileStatus) {
      isNotMyUser = this.configSvc.unMappedUser.profileDetails.profileStatus.toLowerCase() === 'not-my-user' ? true : false
    }
    if (this.configSvc && this.configSvc.unMappedUser
      && this.configSvc.unMappedUser.profileDetails
      && this.configSvc.unMappedUser.profileDetails.employmentDetails
      && this.configSvc.unMappedUser.profileDetails.employmentDetails.departmentName) {
        isIgotOrg = this.configSvc.unMappedUser.profileDetails.employmentDetails.departmentName.toLowerCase() === 'igot' ? true : false
    }
    // let isIgotOrg = true
    if (isNotMyUser && isIgotOrg) {
      this.hideMenu = true
      // this.router.navigateByUrl('app/person-profile/me#profileInfo')
    } else {
      this.hideMenu = false
    }
  }

  ngOnDestroy() {
    if (this.pinnedAppsSubs) {
      this.pinnedAppsSubs.unsubscribe()
    }
  }

  logout() {
    this.raiseTelemetry('signout')
    this.dialog.open<LogoutComponent>(LogoutComponent)
  }

  setPinnedApps() {
    this.pinnedAppsSubs = this.configSvc.pinnedApps.subscribe(pinnedApps => {
      const appsConfig = this.configSvc.appsConfig
      if (!appsConfig) {
        return
      }
      this.pinnedApps = Array.from(pinnedApps)
        .filter(id => id in appsConfig.features)
        .map(id => ({
          widgetType: ROOT_WIDGET_CONFIG.actionButton._type,
          widgetSubType: ROOT_WIDGET_CONFIG.actionButton.feature,
          widgetHostClass: 'w-1/3 px-2 py-3 box-sizing-box',
          widgetData: {
            config: {
              type: 'feature-item',
              useShortName: true,
            },
            actionBtn: appsConfig.features[id],
          },
        }))
    })
  }

  getPortalLinks() {
    this.featuresConfig.forEach((feature: any) => {
      if (feature.id === 'portal_admin' && feature.featureWidgets.length > 0) {
        feature.featureWidgets.forEach((fw: any) => {
          this.portalLinks.push(fw)
        })
      }
    })
  }

  redirectToTourPage() {
    // this.raiseGetStartedImpression('Get Started')
    this.raiseTelemetry('Get Started')
    this.router.navigate(['/page/home'], { relativeTo: this.activatedRoute, queryParamsHandling: 'merge' })
    this.configSvc.updateTourGuideMethod(false)
  }

  redirectToMyLearning() {
    this.raiseTelemetry('My Learning')
    // /app/seeAll?key=continueLearning
    this.router.navigate(['/app/seeAll'], { queryParams: { key: 'continueLearning' } })
  }

  handleRedirectToCompetencyPassbook() {
    this.raiseTelemetry('Learning History')
    this.router.navigate(['/page/competency-passbook/list'])
  }

  raiseTelemetry(tabname: string) {
    const name = tabname.toLowerCase().split(' ').join('-')
    this.events.raiseInteractTelemetry(
      {
        type: WsEvents.EnumInteractTypes.CLICK,
        id: `${name}`,
      },
      {},
      {
        module: WsEvents.EnumTelemetrymodules.HOME,
      }
    )
  }
  redirectToLearnersPage() {
    this.raiseTelemetry('Tips For Learners')
    this.router.navigate(['/learner-advisory'])
  }

  // rasieProfileMenuTelemetry(tabname: string) {
  //   tabname = tabname.toLowerCase().split(' ').join('-')
  //   const data: WsEvents.ITelemetryTabData = {
  //     label: `${tabname}`
  //   }
  //   this.events.handleTabTelemetry(
  //     WsEvents.EnumInteractTypes.CLICK,
  //     data,
  //   )
  // }
}
