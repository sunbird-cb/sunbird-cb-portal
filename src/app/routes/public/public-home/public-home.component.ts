import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core'
import { ConfigurationsService, NsPage, TFetchStatus } from '@sunbird-cb/utils'
import { Subscription } from 'rxjs'
import { ActivatedRoute } from '@angular/router'
import { PublicHomeService } from 'src/app/services/public-home.service'
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'
import { HttpClient } from '@angular/common/http'
import { NsContentStripMultiple } from '@sunbird-cb/collection/src/public-api'
import { NsWidgetResolver } from '@sunbird-cb/resolver/src/public-api'

@Component({
  selector: 'ws-public-home',
  templateUrl: './public-home.component.html',
  styleUrls: ['./public-home.component.scss'],
  // tslint:disable-next-line
  encapsulation: ViewEncapsulation.None,
})
export class PublicHomeComponent implements OnInit, OnDestroy {
  contactUsMail = ''
  contactPage: any
  platform = 'Learner'
  panelOpenState = false
  appIcon: SafeUrl | null = null
  appIconSecondary: SafeUrl | null = null
  pageNavbar: Partial<NsPage.INavBackground> = this.configSvc.pageNavBar
  private subscriptionContact: Subscription | null = null
  learnNetworkSection: any = []
  data!: any

  constructor(
    private phomesrvc: PublicHomeService,
    private configSvc: ConfigurationsService,
    private activateRoute: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    private http: HttpClient,
  ) {
    this.loadData()
  }

  loadData() {
    // this.http.post('/apis/proxies/v8/sunbirdigot/search', {
    //   request: {
    //     filters: {
    //       contentType: [],
    //       primaryCategory: [
    //         'course'
    //       ],
    //       mimeType: [],
    //       source: [],
    //       mediaType: [],
    //       status: [
    //         "Live"
    //       ],
    //       'competencies_v3.name': [],
    //       topics: []
    //     },
    //     query: "",
    //     'sort_by': {
    //       lastUpdatedOn: "desc"
    //     },
    //     fields: [],
    //     facets: [
    //       'primaryCategory',
    //       'mimeType',
    //       'source',
    //       'competencies_v3.name',
    //       'topics'
    //     ],
    //     'limit': 10,
    //     'offset': 0,
    //     'fuzzy': true
    //   }
    // }).subscribe(result => {
    //   console.log(result)
    // })
    this.data = [
      {
        "dimensions": {},
        "className": "new-box",
        "widget": {
          "widgetType": "contentStrip",
          "widgetSubType": "contentStripMultiple",
          "widgetData": {
            "strips": [
              {
                "key": "latest",
                "title": "Newly added courses",
                "info": {
                  "mode": "below",
                  "visibilityMode": "hidden",
                  "icon": {
                    "icon": "info",
                    "scale": 0.8
                  },
                  "widget": {
                    "widgetType": "element",
                    "widgetSubType": "elementHtml",
                    "widgetData": {
                      "html": "<p class=\"ws-mat-primary-text\">This is where you’ll see which topics are in news right now.</p>"
                    }
                  }
                },
                "viewMoreUrl": {},
                "stripConfig": {},
                "filters": [],
                "request": {}
              }
            ]
          }
        }
      }
    ]
  }
  ngOnInit() {
    if (this.configSvc.instanceConfig) {
      this.appIcon = this.domSanitizer.bypassSecurityTrustResourceUrl(
        this.configSvc.instanceConfig.logos.app,
      )
      this.appIconSecondary = this.domSanitizer.bypassSecurityTrustResourceUrl(
        this.configSvc.instanceConfig.logos.appSecondary,
      )
    }
    this.subscriptionContact = this.activateRoute.data.subscribe(data => {
      this.contactPage = data.pageData && data.pageData.data
    })
    if (this.configSvc.instanceConfig) {
      this.contactUsMail = this.configSvc.instanceConfig.mailIds.contactUs
    }

    const url = `${this.configSvc.sitePath}/feature/public-home.json`
    this.phomesrvc.fetchConfig(url).subscribe(
      (config: any) => {
        this.learnNetworkSection = config.learnNetwork
      },
      _err => { })
    // this.authSvc.force_logout().then(() => { })
  }

  ngOnDestroy() {
    if (this.subscriptionContact) {
      this.subscriptionContact.unsubscribe()
    }
  }
  login() {
    const host = window.location.origin
    window.location.href = `${host}/protected/v8/resource`
    // window.location.reload()
  }
  private async processStrip(
    strip: NsContentStripMultiple.IContentStripUnit,
    results: NsWidgetResolver.IRenderConfigWithAnyData[] = [],
    fetchStatus: TFetchStatus,
    calculateParentStatus = true,
    viewMoreUrl: any,
    // calculateParentStatus is used so that parents' status is not re-calculated if the API is called again coz of filters, etc.
  ) {
    // this.stripsResultDataMap[strip.key]
    if (results.length && strip.fetchLikes) {
      await this.processContentLikes(results)
    }
    const stripData = {
      viewMoreUrl,
      key: strip.key,
      canHideStrip: Boolean(strip.canHideStrip),
      showStrip: this.getIfStripHidden(strip.key),
      noDataWidget: strip.noDataWidget,
      errorWidget: strip.errorWidget,
      stripInfo: strip.info,
      stripTitle: strip.title,
      stripName: strip.name,
      mode: strip.mode,
      stripBackground: strip.stripBackground,
      widgets:
        fetchStatus === 'done'
          ? [
            ...(strip.preWidgets || []).map(w => ({
              ...w,
              widgetHostClass: `mb-2 ${w.widgetHostClass}`,
            })),
            ...results,
            ...(strip.postWidgets || []).map(w => ({
              ...w,
              widgetHostClass: `mb-2 ${w.widgetHostClass}`,
            })),
          ]
          : [],
      showOnNoData: Boolean(
        strip.noDataWidget &&
        !((strip.preWidgets || []).length + results.length + (strip.postWidgets || []).length) &&
        fetchStatus === 'done',
      ),
      showOnLoader: Boolean(strip.loader && fetchStatus === 'fetching'),
      showOnError: Boolean(strip.errorWidget && fetchStatus === 'error'),
    }
    // const stripData = this.stripsResultDataMap[strip.key]
    this.stripsResultDataMap = {
      ...this.stripsResultDataMap,
      [strip.key]: stripData,
    }
    if (
      calculateParentStatus &&
      (fetchStatus === 'done' || fetchStatus === 'error') &&
      stripData.widgets
    ) {
      this.checkParentStatus(fetchStatus, stripData.widgets.length)
    }
    if (calculateParentStatus && !(results && results.length > 0)) {
      this.contentAvailable = false
    } else if (results && results.length > 0) {
      this.contentAvailable = true
    }
  }
  private getIfStripHidden(key: string): boolean {
    const storageItem = sessionStorage.getItem(`cstrip_${key}`)
    return Boolean(storageItem !== '1')
  }
}
