import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { CommonMethodsService } from '@sunbird-cb/consumption'
import { KarmaProgramsService } from '../service/karma-programs.service'
import { EventService, WsEvents, MultilingualTranslationsService, ConfigurationsService } from '@sunbird-cb/utils-v2'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'ws-app-karma-programs-microsite-v1',
  templateUrl: './karma-programs-microsite-v1.component.html',
  styleUrls: ['./karma-programs-microsite-v1.component.scss'],
})
export class KarmaProgramsMicrositeV1Component implements OnInit {
  programName = ''
  playListKey = ''
  orgId = ''
  sectionList: any = []
  contentDataList: any = []
  originalContentlist: any = []
  seeAllPageConfig: any
  titles = [
    { title: 'Learn', url: '/page/learn', icon: 'school', disableTranslate: false },
    {
      title: `Karma Programs`,
      url: `/app/learn/karma-programs/all-programs`,
      icon: '', disableTranslate: true,
    },
  ]
  loadContentSearch = false
  descriptionMaxLength = 750
  constructor(private route: ActivatedRoute,
              public contentSvc: KarmaProgramsService,
              private translate: TranslateService,
              private langtranslations: MultilingualTranslationsService,
              public eventSvc: EventService,
              private configSvc: ConfigurationsService,
              public commonSvc: CommonMethodsService) {
                this.langtranslations.languageSelectedObservable.subscribe(() => {
                  if (localStorage.getItem('websiteLanguage')) {
                    this.translate.setDefaultLang('en')
                    const lang = localStorage.getItem('websiteLanguage')!
                    this.translate.use(lang)
                  }
                })
              }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.programName = params['programName']
      this.playListKey = params['playListKey']
      this.orgId = params['orgId']
      this.titles.push({
        title: this.programName, icon: '', url: 'none', disableTranslate: true,
      })
    })
    if (this.route.snapshot.data && this.route.snapshot.data.formData
      && this.route.snapshot.data.formData.data
      && this.route.snapshot.data.formData.data.result
      && this.route.snapshot.data.formData.data.result.form
      && this.route.snapshot.data.formData.data.result.form.data
      && this.route.snapshot.data.formData.data.result.form.data.sectionList
    ) {
      this.sectionList = this.route.snapshot.data.formData.data.result.form.data.sectionList

      this.getDataFromSearch()
    }

  }

  async getDataFromSearch(requestData?: any) {
    const request  = requestData || this.formRequest()
    const sectionData = this.sectionList.filter((ele: any) => ele.key === 'contentSearch')
    if (sectionData && sectionData.length) {
    const strip: any = sectionData[0].column[0].data && sectionData[0].column[0].data.strips[0] || {}
    this.seeAllPageConfig = strip
    try {
      this.loadContentSearch = true
      const response = await this.fetchFromSearchV6(request)
      if (response && response.results) {
        if (response.results.result.content) {
          let contentList = []
          if (this.configSvc && this.configSvc.unMappedUser &&
               this.configSvc.unMappedUser.profileDetails &&
               this.configSvc.unMappedUser.profileDetails.profileStatus &&
               this.configSvc.unMappedUser.profileDetails.profileStatus === 'VERIFIED') {
          contentList = response.results.result.content
        } else {
          contentList = response.results.result.content.filter((ele: any) => {
            if (ele.secureSettings) {
              return ele.secureSettings && ele.secureSettings.isVerifiedKarmayogi === 'No'
            }
            return ele
          })
        }
         this.contentDataList = this.commonSvc.transformContentsToWidgets(contentList, strip)
         this.originalContentlist = contentList
        }
        this.loadContentSearch = false
      }
    } catch (error) {
      // Handle errors
      // console.error('Error:', error);
    }
    }
  }

  async fetchFromSearchV6(request: any) {
      return new Promise<any>((resolve, reject) => {
        if (request && request) {
          this.contentSvc.fetchPlaylistSearchData(this.playListKey, this.orgId).subscribe(results => {
              resolve({ results })
            },                                                                            (error: any) => {
              reject(error)
            },
          )
        }
      })
  }
  // handleSearchQuery(e: any) {
  //   if (e.target.value) {
  //     const request = this.formRequest(e.target.value)
  //     this.getDataFromSearch(request)
  //   }
  // }

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

  formRequest(queryText?: any, addFilter?: any) {
    this.loadCardSkeletonLoader()
    const request: any = {
      'request': {
          'query': queryText || '',
          'filters': {
              'contentType': 'Course',
              ...addFilter,
              'status': [
                  'Live',
              ],
          },
          'sort_by': {
              'lastUpdatedOn': 'desc',
          },
          'offset': 0,
          'fields': [
          ],
      },
    }
    return request
  }

  loadCardSkeletonLoader() {
    const sectionData = this.sectionList.filter((ele: any) => ele.key === 'contentSearch')
    if (sectionData && sectionData.length) {
        const strip: any = sectionData[0].column[0].data && sectionData[0].column[0].data.strips[0]
      this.contentDataList = this.commonSvc.transformSkeletonToWidgets(strip)
    }
  }

  raiseTelemetryInteratEvent(event: any) {
    this.eventSvc.raiseInteractTelemetry(
      {
        type: 'click',
        subType: 'karma-programs',
        id: `card-content`,
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
