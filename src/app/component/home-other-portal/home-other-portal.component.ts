import { Component, OnInit } from '@angular/core'
import { NsPage, NsAppsConfig, ConfigurationsService, WsEvents, EventService, MultilingualTranslationsService } from '@sunbird-cb/utils'
import { NsWidgetResolver } from '@sunbird-cb/resolver'
import { AccessControlService } from '@ws/author/src/public-api'
import { ROOT_WIDGET_CONFIG } from '@sunbird-cb/collection/src/lib/collection.config'

/* tslint:disable*/
import _ from 'lodash'
import { TranslateService } from '@ngx-translate/core'


interface IGroupWithFeatureWidgets extends NsAppsConfig.IGroup {
  featureWidgets: NsWidgetResolver.IRenderConfigWithTypedData<NsPage.INavLink>[]
}

@Component({
  selector: 'ws-home-other-portal',
  templateUrl: './home-other-portal.component.html',
  styleUrls: ['./home-other-portal.component.scss']
})
export class HomeOtherPortalComponent implements OnInit {

  private readonly featuresConfig: IGroupWithFeatureWidgets[] = []
  portalLinks: any[] = []
  noPortal = [1,2,3]
  showSkeleton = true;

  constructor(
    private configSvc: ConfigurationsService,
    private accessService: AccessControlService,
    private langtranslations: MultilingualTranslationsService,
    private translate: TranslateService,
    private events: EventService
  ) { 
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
      let lang = JSON.stringify(localStorage.getItem('websiteLanguage'))
      lang = lang.replace(/\"/g, '')
      this.translate.use(lang)
    }

    this.langtranslations.languageSelectedObservable.subscribe(() => {
      if (localStorage.getItem('websiteLanguage')) {
        this.translate.setDefaultLang('en')
        const lang = localStorage.getItem('websiteLanguage')!
        this.translate.use(lang)
      }
    })
  }

  ngOnInit() {
    if (this.featuresConfig && this.featuresConfig.length > 0) {
      this.getPortalLinks()
    }
  }

  translateLabels(label: string, type: any) {
    return this.langtranslations.translateLabel(label, type, '')
  }

  getPortalLinks() {
    this.featuresConfig.forEach((feature: any) => {
      if (feature.id === 'portal_admin' && feature.featureWidgets.length > 0) {        
        feature.featureWidgets.forEach((fw: any) => {
          this.portalLinks.push(fw)
        })
      }
      this.showSkeleton = false;
    })
  }

  raiseTelemetry(wdata: any) {
    const name = wdata.widgetData.actionBtn.name.toLowerCase().split(' ')
    this.events.raiseInteractTelemetry(
      {
        type: WsEvents.EnumInteractTypes.CLICK,
        subType: WsEvents.EnumInteractSubTypes.PORTAL_NUDGE,
        id: `${name[0]}-portal-nudge`
      },
      {},
      {
        module: WsEvents.EnumTelemetrymodules.HOME
      }
    )
  }

}
