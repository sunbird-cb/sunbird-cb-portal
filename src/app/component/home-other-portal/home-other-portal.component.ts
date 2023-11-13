import { Component, OnInit } from '@angular/core'
import { NsPage, NsAppsConfig, ConfigurationsService } from '@sunbird-cb/utils'
import { NsWidgetResolver } from '@sunbird-cb/resolver'
import { AccessControlService } from '@ws/author/src/public-api'
import { ROOT_WIDGET_CONFIG } from '@sunbird-cb/collection/src/lib/collection.config'

/* tslint:disable*/
import _ from 'lodash'


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
  

  constructor(
    private configSvc: ConfigurationsService,
    private accessService: AccessControlService,
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
  }

  ngOnInit() {
    if (this.featuresConfig && this.featuresConfig.length > 0) {
      this.getPortalLinks()
    }
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

}
