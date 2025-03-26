import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { CommonMethodsService } from '@sunbird-cb/consumption'
import { NsContentStripWithTabs } from '@sunbird-cb/consumption/lib/_common/content-strip-with-tabs-lib/content-strip-with-tabs-lib.model'

import { BrowseProviderService } from '../../services/browse-provider.service'
import { UtilityService } from '@sunbird-cb/utils-v2'
import { environment } from 'src/environments/environment'
import { FormExtService } from 'src/app/services/form-ext.service'

@Component({
  selector: 'ws-app-provider-content-all',
  templateUrl: './provider-content-all.component.html',
  styleUrls: ['./provider-content-all.component.scss'],
})
export class ProviderContentAllComponent implements OnInit, OnDestroy {

  providerName = ''
  providerId = ''
  seeAllPageConfig: any = {}
  keyData: any
  contentDataList: any = []
  tabSelected: any = ''
  originalContentlist: any = []
  isMobile = false
  requestData: any
  selectedTab: any
  titles = [
    { title: 'Learn', url: '/page/learn', icon: 'school', disableTranslate: false },
    { title: `All Providers`, url: `/app/learn/browse-by/provider/all-providers`, icon: '', disableTranslate: false },
    // { title: `${this.provider}`, url: `none`, icon: '' },
  ]
  constructor(public commonSvc: CommonMethodsService,
              public activatedRoute: ActivatedRoute,
              public contentSvc: BrowseProviderService,
              public utilitySvc: UtilityService,
              public formExtSvc: FormExtService
  ) {
   }

  ngOnInit( ) {
    this.activatedRoute.params.subscribe(params => {
      this.providerName = params['provider']
      this.providerId = params['orgId']
      this.activatedRoute.queryParams.subscribe(queryparams => {
        this.tabSelected = queryparams.tabSelected || ''
        this.getFormData(queryparams)
      })

    })
  }
  getFormData(queryparams: any) {
    if (this.providerName && this.providerId) {
      const requestData: any = {
        'request': {
            'type': 'ATI-CTI',
            'subType': 'microsite-v2',
            'action': 'page-configuration',
            'component': 'portal',
            'rootOrgId': this.providerId,
        },
      }
      this.formExtSvc.formReadData(requestData).subscribe((res: any) => {
        if (res && res.result && res.result.form && res.result.form.data && res.result.form.data.sectionList) {
          const filterData = res.result.form.data.sectionList.filter((ele: any) => ele.key === queryparams.key)
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
            const urlTomicrosite = `/app/learn/browse-by/provider/${this.providerName}/${this.providerId}/micro-sites`
            this.titles.push({ title: this.providerName, icon: '', url: urlTomicrosite,  disableTranslate: true })
            this.titles.push({ title: this.seeAllPageConfig.title, icon: '', url: 'none', disableTranslate: false })
            this.contentDataList = this.commonSvc.transformSkeletonToWidgets(data)
            this.callApi()
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

  getFullUrl(apiUrl: any, id: string) {
    let formedUrl: string = apiUrl
    if (apiUrl.indexOf('<bookmarkId>') >= 0) {
      formedUrl = apiUrl.replace('<bookmarkId>', environment.mdoChannelsBookmarkId)
    } else if (apiUrl.indexOf('<playlistKey>') >= 0 && apiUrl.indexOf('<orgID>') >= 0) {
      formedUrl = apiUrl.replace('<playlistKey>', this.providerId + id)
      formedUrl = formedUrl.replace('<orgID>', this.providerId)
    }
    return formedUrl
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
        } else {
          this.contentDataList = []
        }
      } catch (error) {
        // Handle errors
        // console.error('Error:', error);
      }
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
            this.originalContentlist = response.results.result.content
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
            this.originalContentlist = response.results.result.content
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

  postMethodFilters(filters: any) {
    if (filters.organisation &&
      filters.organisation.indexOf('<orgID>') >= 0
    ) {
      filters.organisation = filters.organisation.replace('<orgID>', this.providerId)
    }
    return filters
  }

  handleSearchQuery(e: any) {
    if (e.target.value || e.target.value === '') {
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

  ngOnDestroy(): void {
      localStorage.removeItem('stripData')
  }

}
