import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { VIEWER_ROUTE_FROM_MIME } from '@sunbird-cb/collection/src/public-api'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { ViewerDataService } from '@ws/viewer/src/public-api'

@Component({
  selector: 'ws-app-gyaan-player',
  templateUrl: './gyaan-player.component.html',
  styleUrls: ['./gyaan-player.component.scss'],
})
export class GyaanPlayerComponent implements OnInit {
  resourceData: any
  titles: any = []
  enableShare = false
  rootOrgId: any
  resourceLink: any = ''
  pageConfig: any
  relatedContentStrip: any

  constructor(private viewerDataSvc: ViewerDataService,
              private configSvc: ConfigurationsService,
              private route: ActivatedRoute,
              public translate: TranslateService, private router: Router) {
    if (this.route.parent && this.route.parent.snapshot.data.pageData
      && this.route.parent.snapshot.data.pageData.data
      && this.route.parent.snapshot.data.pageData.data.stripConfig) {
        this.pageConfig = JSON.parse(JSON.stringify(this.route.parent && this.route.parent.snapshot.data.pageData.data))
      }
    this.router.events.subscribe(val => {
        // see also
        if (val instanceof NavigationEnd) {
          this.resourceData = this.viewerDataSvc.resource
          this.relatedContentStrip = {}
          this.getRelatedContent()
        }
    })
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
    if (this.configSvc.userProfile) {
      this.rootOrgId = this.configSvc.userProfile.rootOrgId
    }
    this.resourceLink = `${window.location.pathname.substring(1)}${window.location.search}`
  }

  ngOnInit() {
    this.resourceData = this.viewerDataSvc.resource
    this.getRelatedContent()
    this.titles = [
      { title: 'Gyaan Karmayogi', url: '/app/gyaan-karmayogi/all', icon: 'school' },
      { title: this.resourceData.resourceCategory, disableTranslate: true,
        queryParams: { key: this.resourceData.resourceCategory }, url: `/app/gyaan-karmayogi/view-all`, icon: '' },
      { title: this.resourceData.name, url: `none`, icon: '' },
    ]
  }
  // this method is used to close the share popup
  resetEnableShare() {
    this.enableShare = false
  }
// the below method is used to get resource type
  get getMimeType() {
    if (this.resourceData) {
      const mimetype = this.resourceData && this.resourceData.mimeType
      return VIEWER_ROUTE_FROM_MIME(mimetype)
    }
    return ''
  }
  // the below method is used to form releated content request
  getRelatedContent() {
    if (this.resourceData && this.pageConfig.stripConfig) {
      const negetContent: any = {
        'name': {
          '!=': [
              this.resourceData.name,
          ],
        },
      }
      const stripData = JSON.parse(JSON.stringify(this.pageConfig.stripConfig))
      stripData.strips[0].title = 'Related resources'
      stripData.strips[0].request.searchV6.request.limit = 3
      stripData.strips[0].request.searchV6.request.filters = {
          ...stripData.strips[0].request.searchV6.request.filters,
          ...(this.resourceData.sectorName ? { sectorName: this.resourceData.sectorName } : null),
          ...(this.resourceData.subSectorName ? { subSectorName: this.resourceData.subSectorName } : null),
          ...(this.resourceData.resourceCategory ? { resourceCategory: this.resourceData.resourceCategory } : null),
          ...negetContent,
      }
      this.relatedContentStrip = stripData
    }
  }
}
