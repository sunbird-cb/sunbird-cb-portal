import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { CommonMethodsService } from '@sunbird-cb/consumption'
import { NsContentStripWithTabs } from '@sunbird-cb/consumption/lib/_common/content-strip-with-tabs-lib/content-strip-with-tabs-lib.model'

import { AllContentService } from './../service/all-content.service'
import { EventService, UtilityService, WsEvents, MultilingualTranslationsService } from '@sunbird-cb/utils-v2'
import { environment } from 'src/environments/environment'
import { TranslateService } from '@ngx-translate/core'
import { FormExtService } from 'src/app/services/form-ext.service'

@Component({
  selector: 'ws-app-mdo-channels-all-content',
  templateUrl: './mdo-channels-all-content.component.html',
  styleUrls: ['./mdo-channels-all-content.component.scss'],
})
export class MdoChannelsAllContentComponent implements OnInit {

  orgName = ''
  orgId = ''
  seeAllPageConfig: any = {}
  keyData: any
  contentDataList: any = []
  originalContentlist: any = []
  isMobile = false
  tabSelected: any = ''
  requestData: any
  selectedTab: any
  titles: any = []
  constructor(public commonSvc: CommonMethodsService,
              public activatedRoute: ActivatedRoute,
              public formExtSvc: FormExtService,
              public contentSvc: AllContentService,
              private translate: TranslateService,
              private langtranslations: MultilingualTranslationsService,
              public utilitySvc: UtilityService,
              public events: EventService,
  ) {
    this.langtranslations.languageSelectedObservable.subscribe(() => {
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
  })

   }

  ngOnInit( ) {
    this.activatedRoute.params.subscribe(params => {
      this.orgName = params['channel']
      this.orgId = params['orgId']
      this.tabSelected = this.activatedRoute.snapshot.queryParams.tabSelected || ''
      this.getFormData(this.activatedRoute.snapshot.queryParams)
      // if (this.activatedRoute.snapshot.queryParams && this.activatedRoute.snapshot.queryParams.stripData) {
        // const data  = JSON.parse(this.activatedRoute.snapshot.queryParams.stripData)
        // this.isMobile = this.utilitySvc.isMobile || false
        // if (this.isMobile) {
        //   data['stripConfig']['cardSubType'] = 'card-wide-lib'
        //   data['loaderConfig']['cardSubType'] = 'card-wide-lib-skeleton'
        // } else {
        //   data['stripConfig']['cardSubType'] = 'card-wide-v2'
        //   data['loaderConfig']['cardSubType'] = 'card-wide-v2-skeleton'
        // }
        // this.seeAllPageConfig = data
        // this.contentDataList = this.commonSvc.transformSkeletonToWidgets(data)
      // }
    })
    // this.titles = [
    //   { title: 'Learn', url: '/page/learn', icon: 'school', disableTranslate: false },
    //   { title: `MDO Channels`, url: `/app/learn/mdo-channels/all-channels`, icon: '', disableTranslate: true },
    //   {
    //     title: this.orgName,
    //     url: `/app/learn/mdo-channels/${this.orgName}/${this.orgId}/micro-sites`,
    //     disableTranslate: true,
    //   },
    //   { title: this.seeAllPageConfig.title,
    //     icon: '',
    //     url: 'none',
    //     disableTranslate: false,
    //   },
    // ]
    // this.callApi()
  }

  getFormData(queryparams: any) {
    if (this.orgName && this.orgId) {
      const requestData: any = {
        'request': {
            'type': 'MDO-channel',
            'subType': 'microsite-v2',
            'action': 'page-configuration',
            'component': 'portal',
            'rootOrgId': this.orgId,
        },
      }
      this.formExtSvc.formReadData(requestData).subscribe((res: any) => {
        if (res && res.result && res.result.form && res.result.form.data && res.result.form.data.sectionList) {
          const mainSectionData = res.result.form.data.sectionList.filter((ele: any) => ele.key === 'sectionMain')
          if (mainSectionData[0] &&
            mainSectionData[0].column[0] &&
            mainSectionData[0].column[0].data &&
            mainSectionData[0].column[0].data.tabSection &&
            mainSectionData[0].column[0].data.tabSection.contentTab) {
            const filterData = mainSectionData[0].column[0].data.tabSection.contentTab.filter((ele: any) => ele.key === queryparams.key)
            if (filterData && filterData[0] && filterData[0].column[0]  && filterData[0].column[0].data.strips) {
              const data  = filterData[0].column[0].data.strips[0]
              this.isMobile = this.utilitySvc.isMobile || false
              if (this.isMobile) {
                data['stripConfig']['cardSubType'] = 'card-wide-lib'
                data['loaderConfig']['cardSubType'] = 'card-wide-lib-skeleton'
              } else {
                data['stripConfig']['cardSubType'] = 'card-wide-v2'
                data['loaderConfig']['cardSubType'] = 'card-wide-v2-skeleton'
              }
              this.seeAllPageConfig = data
              this.contentDataList = this.commonSvc.transformSkeletonToWidgets(data)
              this.titles = [
                { title: 'Learn', url: '/page/learn', icon: 'school', disableTranslate: false },
                { title: `MDO Channels`, url: `/app/learn/mdo-channels/all-channels`, icon: '', disableTranslate: true },
                {
                  title: this.orgName,
                  url: `/app/learn/mdo-channels/${this.orgName}/${this.orgId}/micro-sites`,
                  disableTranslate: true,
                },
                { title: this.seeAllPageConfig.title,
                  icon: '',
                  url: 'none',
                  disableTranslate: false,
                },
              ]
              this.callApi()
            }
          }
        }
      },                                                  (_err: any) => {
        this.contentDataList = []
      })
    }
  }

  callApi(query?: any) {
    let tabData: any
    if (this.tabSelected) {
      tabData = this.seeAllPageConfig.tabs.find((
        el: any
      ) => el.label.toLowerCase() === this.tabSelected.toLowerCase())
      this.seeAllPageConfig.request = tabData.request
      this.selectedTab = tabData
    } else {
      tabData = this.seeAllPageConfig.tabs[0]
      this.seeAllPageConfig.request = tabData.request
      this.selectedTab = tabData
    }
    if (this.seeAllPageConfig.request && this.seeAllPageConfig.request.topContent) {
      this.fetchAllTopContent(this.seeAllPageConfig, query)
    } else if (this.seeAllPageConfig.request && this.seeAllPageConfig.request.featureContent) {
      this.fetchAllFeaturedContent(this.seeAllPageConfig, query)
    } else if (this.seeAllPageConfig.request && this.seeAllPageConfig.request.playlistRead) {
      this.fetchPlaylistReadData(this.seeAllPageConfig, query)
    }
  }

  async fetchAllTopContent(strip: NsContentStripWithTabs.IContentStripUnit, querydata?: any) {
    if (strip.request && strip.request.topContent && Object.keys(strip.request.topContent).length) {

      if (strip.request &&
        strip.request.topContent &&
        strip.request.topContent.request &&
        strip.request.topContent.request.filters) {
        strip.request.topContent.request.query = querydata || ''
        strip.request.topContent.request.filters = this.postMethodFilters(strip.request.topContent.request.filters)
      }
      try {
        const response = await this.postRequestMethod(strip.request.topContent, strip.request.apiUrl)
        // console.log('calling  after - response, ', response)
        if (response && response.results) {
          // console.log('calling  after-- ')
          if (response.results.result.content && response.results.result.content.length) {
            this.contentDataList = this.commonSvc.transformContentsToWidgets(response.results.result.content, strip)
          } else {
            this.contentDataList = []
          }

        } else {
          this.contentDataList = []
        }
      } catch (error) {
        // Handle errors
        // console.error('Error:', error);
      }
    }
  }

  async fetchAllFeaturedContent(strip: NsContentStripWithTabs.IContentStripUnit, querydata?: any) {
    if (strip.request && strip.request.featureContent && Object.keys(strip.request.featureContent).length) {
      if (strip.request &&
        strip.request.featureContent &&
        strip.request.featureContent.request &&
        strip.request.featureContent.request.filters) {
        strip.request.featureContent.request.query = querydata || ''
        strip.request.featureContent.request.filters = this.postMethodFilters(strip.request.featureContent.request.filters)
      }
      try {
        const response = await this.postRequestMethod(strip.request.featureContent, strip.request.apiUrl)
        // console.log('calling  after - response, ', response)
        if (response && response.results) {
          // console.log('calling  after-- ')
          if (response.results.result.content && response.results.result.content.length) {
            this.contentDataList = this.commonSvc.transformContentsToWidgets(response.results.result.content, strip)

          } else {
            this.contentDataList = []
          }

        } else {
          this.contentDataList = []
        }
      } catch (error) {
        this.contentDataList = []
        // Handle errors
        // console.error('Error:', error);
      }
    }
  }

  async postRequestMethod(
    request: NsContentStripWithTabs.IContentStripUnit['request'],
    apiUrl: string,
  ): Promise<any> {
    this.requestData = request
    return new Promise<any>((resolve, reject) => {
      if (request && request) {
        this.contentSvc.postApiMethod(apiUrl, request).subscribe(results => {
        resolve({ results })
        },                                                       (error: any) => {
        reject(error)
        },
        )
      }
    })
  }

  async fetchPlaylistReadData(strip: NsContentStripWithTabs.IContentStripUnit, _querydata?: any) {
    if (strip.request && strip.request.playlistRead && Object.keys(strip.request.playlistRead).length) {
      if (strip.request &&
        strip.request.playlistRead &&
        strip.request.playlistRead.type) {
        strip.request.apiUrl = this.getFullUrl(strip.request.apiUrl, strip.request.playlistRead.type)
      }
      try {
        const response = await this.getRequestMethod(strip, strip.request.playlistRead, strip.request.apiUrl)
        if (response && response.results.result.content) {
          const content  = response.results.result.content
          this.originalContentlist = content
          this.contentDataList = this.commonSvc.transformContentsToWidgets(content, strip)
          // this.processStrip(
          //   strip,
          //   this.transformAllContentsToWidgets(content, strip),
          //   'done',
          //   calculateParentStatus,
          //   response,
          // );

        } else {
          this.contentDataList = []
          // this.processStrip(strip, [], 'error', calculateParentStatus, null);
          // this.emptyResponse.emit(true)
        }
      } catch (error) {
        // Handle errors
        // console.error('Error:', error);
      }
    }
  }

  async getRequestMethod(strip: NsContentStripWithTabs.IContentStripUnit,
                         request: NsContentStripWithTabs.IContentStripUnit['request'],
                         apiUrl: string
  ): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      if (request && request) {
        this.contentSvc.getApiMethod(apiUrl).subscribe(results => {
        const showViewMore = Boolean(
        results.result.data && results.result.data.orgList.length > 5 && strip.stripConfig && strip.stripConfig.postCardForSearch,
        )
        const viewMoreUrl = showViewMore
        ? {
        path: strip.viewMoreUrl && strip.viewMoreUrl.path || '',
        }
        : null
        resolve({ results, viewMoreUrl })
        },                                             (error: any) => {
        reject(error)
        },
        )
      }
    })
  }

  postMethodFilters(filters: any) {
    if (filters.organisation &&
      filters.organisation.indexOf('<orgID>') >= 0
    ) {
      filters.organisation = filters.organisation.replace('<orgID>', this.orgId)
    }
    return filters
  }

  handleSearchQuery(e: any) {
    if (e.target.value || e.target.value === '') {
      this.contentDataList = this.commonSvc.transformSkeletonToWidgets(this.seeAllPageConfig)
      // this.callApi(e.target.value)
      this.filterContentList(e.target.value)
    }
  }
  filterContentList(searchText: string) {
    const data = [...this.originalContentlist]
    const filterValue = searchText.toLowerCase()
    const filteredData = data.filter((p: any) => p &&  p.name && p.name.toLowerCase().includes(filterValue))
    this.contentDataList  = this.commonSvc.transformContentsToWidgets(filteredData, this.seeAllPageConfig)
  }

  getFullUrl(apiUrl: any, id: string) {
    let formedUrl: string = apiUrl
    if (apiUrl.indexOf('<bookmarkId>') >= 0) {
      formedUrl = apiUrl.replace('<bookmarkId>', environment.mdoChannelsBookmarkId)
    } else if (apiUrl.indexOf('<playlistKey>') >= 0 && apiUrl.indexOf('<orgID>') >= 0) {
      formedUrl = apiUrl.replace('<playlistKey>', this.orgId + id)
      formedUrl = formedUrl.replace('<orgID>', this.orgId)
    }
    return formedUrl
  }

  raiseTelemetryInteratEvent(event: any) {
    this.events.raiseInteractTelemetry(
      {
        type: 'click',
        subType: 'mdo-channel',
        id: 'content-card',
      },
      {
        id: event.identifier,
        type: event.primaryCategory,
      },
      {
        module: WsEvents.EnumTelemetrymodules.LEARN,
      }
    )
  }

}
