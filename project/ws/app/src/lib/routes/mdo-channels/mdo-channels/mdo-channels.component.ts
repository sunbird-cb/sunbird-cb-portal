import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { Observable, Subject } from 'rxjs'
import { BrowseProviderService } from '../../browse-by-provider/services/browse-provider.service'
import { LocalDataService } from '../../browse-by-competency/services/localService'
import { TranslateService } from '@ngx-translate/core'
import { MultilingualTranslationsService } from '@sunbird-cb/utils-v2'
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators'
// tslint:disable
import _ from 'lodash'

@Component({
  selector: 'ws-app-mdo-channels',
  templateUrl: './mdo-channels.component.html',
  styleUrls: ['./mdo-channels.component.scss'],
})
export class MdoChannelsComponent implements OnInit {
  public displayLoader!: Observable<boolean>
  provider = 'JPAL'
  page = 1
  defaultLimit = 20
  limit = 20
  searchForm: FormGroup | undefined
  sortBy: any
  searchQuery = ''
  allProviders: any
  clonesProviders: any
  disableLoadMore = false
  totalCount = 0
  private unsubscribe = new Subject<void>()
  titles = [
    { title: 'Channels', url: 'none', icon: '' },
  ]
  getAllProvidersReq = {
    request: {
      filters: {
        isCbp: true,
      },
      sort_by: {
        orgName: 'asc',
      },
      query: '',
      limit: this.limit,
      offset: 0,
    },
  }
  constructor(
    private browseProviderSvc: BrowseProviderService,
    private localService: LocalDataService,
    private translate: TranslateService,
    private langtranslations: MultilingualTranslationsService,
  ) {
    this.langtranslations.languageSelectedObservable.subscribe(() => {
      if (localStorage.getItem('websiteLanguage')) {
        this.translate.setDefaultLang('en')
        const lang = localStorage.getItem('websiteLanguage')!
        this.translate.use(lang)
      }
    })
    this.allProviders = [
      {
        content: {
          // tslint:disable-next-line: max-line-length
          posterImage: 'https://portal.karmayogi.nic.in/content-store/content/do_114051411119235072127/artifact/do_114051411119235072127_1715260168985_default-provider.svg',
          appIcon: '',
          name: 'Ministry of Consumer Affairs, Food and Public Distribution',
        },
      },
      {
        content: {
          // tslint:disable-next-line: max-line-length
            posterImage: 'https://portal.karmayogi.nic.in/content-store/content/do_114051411119235072127/artifact/do_114051411119235072127_1715260168985_default-provider.svg',
            appIcon: '',
            name: 'Ministry of Railways',
        },
      },
      {
        content: {
          // tslint:disable-next-line: max-line-length
            posterImage: 'https://portal.karmayogi.nic.in/content-store/content/do_114051411119235072127/artifact/do_114051411119235072127_1715260168985_default-provider.svg',
            appIcon: '',
            name: 'Department of Post',
        },
      },
      {
        content: {
          // tslint:disable-next-line: max-line-length
            posterImage: 'https://portal.karmayogi.nic.in/content-store/content/do_114051411119235072127/artifact/do_114051411119235072127_1715260168985_default-provider.svg',
            appIcon: '',
            name: 'NLC India Limited',
        },
      },
      {
        content: {
          // tslint:disable-next-line: max-line-length
            posterImage: 'https://portal.karmayogi.nic.in/content-store/content/do_114051411119235072127/artifact/do_114051411119235072127_1715260168985_default-provider.svg',
            appIcon: '',
            name: 'Mission Karmayogi',
        },
      },
      {
        content: {
          // tslint:disable-next-line: max-line-length
            posterImage: 'https://portal.karmayogi.nic.in/content-store/content/do_114051411119235072127/artifact/do_114051411119235072127_1715260168985_default-provider.svg',
            appIcon: '',
            name: 'Mission Karmayogi',
        },
      },

    ]
    this.clonesProviders = this.allProviders
   }

  ngOnInit() {
    this.searchForm = new FormGroup({
      sortByControl: new FormControl(''),
      searchKey: new FormControl(''),
    })
    this.displayLoader = this.browseProviderSvc.isLoading()
    this.searchForm.valueChanges
      .pipe(
        debounceTime(500),
        switchMap(async (formValue: any) => {
          this.sortBy = formValue.sortByControl
          this.updateQuery(formValue.searchKey)
        }),
        takeUntil(this.unsubscribe)
      ).subscribe()
    // this.getAllProviders()
  }

  getAllProviders(req?: any) {
    this.allProviders = []
    const request = req || this.getAllProvidersReq
    let data = this.localService.providers.getValue()
    if (data && data.length === 0) {
      this.browseProviderSvc.fetchAllProviders(request).subscribe(response => {
        this.localService.initProviders(response)
        // if (res && res.result &&  res.result.response && res.result.response.content) {
        //   this.allProviders = res.result.response.content
        //   this.totalCount = res.result.response.count
        //   if ((this.page * this.defaultLimit) >= this.totalCount) {
        //     this.disableLoadMore = true
        //   } else {
        //     this.disableLoadMore = false
        //   }
        // }
        if (response) {
          const res = _.toArray(_.pickBy(response, v => v !== null && v !== undefined && !!v.name))
          const fData: any[] = []
          if (this.searchQuery) {
            _.each(res, (d: any) => {
              let found = false
              found = _.includes(_.lowerCase(this.searchQuery), _.lowerCase(_.get(d, 'name')))
                || _.includes(_.lowerCase(_.get(d, 'name')), _.lowerCase(this.searchQuery))
              if (found) {
                fData.push(d)
              }
            })
            this.allProviders = fData
          }
          if (this.sortBy) {
            this.allProviders = _.orderBy(fData.length ? fData : res, ['name'], [this.sortBy])
          } else {
            this.allProviders = fData.length ? fData : res
          }
          if (!this.searchQuery && !this.sortBy) {
            this.allProviders = fData.length ? fData : res
          }
          this.totalCount = fData.length || res.length
          if ((this.page * this.defaultLimit) >= this.totalCount) {
            this.disableLoadMore = true
          } else {
            this.disableLoadMore = false
          }
        }
      })
    } else {
      const fData: any[] = []
      data = _.toArray(_.pickBy(data, v => v !== null && v !== undefined && !!v.name))
      if (this.searchQuery) {
        _.each(data, (d: any) => {
          let found = false
          found = _.includes(_.lowerCase(this.searchQuery), _.lowerCase(_.get(d, 'name')))
            || _.includes(_.lowerCase(_.get(d, 'name')), _.lowerCase(this.searchQuery))
          if (found) {
            fData.push(d)
          }
        })
        this.allProviders = fData
      }
      if (this.sortBy) {
        this.allProviders = _.orderBy((fData.length ? fData : data), ['name'], [this.sortBy])
      }
      if (!this.searchQuery && !this.sortBy) {
        this.allProviders = fData.length ? fData : data
      }
      this.totalCount = data.length
      if ((this.page * this.defaultLimit) >= this.totalCount) {
        this.disableLoadMore = true
      } else {
        this.disableLoadMore = false
      }
    }
  }

  updateQuery(key: string) {
    this.searchQuery = key
    this.getAllProvidersReq.request.query = this.searchQuery
    this.getAllProvidersReq.request.offset = 0
    this.getAllProvidersReq.request.limit = this.defaultLimit
    this.page = 1
    this.getAllProvidersReq.request.sort_by.orgName = this.sortBy
    // this.getAllProviders()
    this.filterChannles(key)
  }

  filterChannles(value: string) {
    if (value) {
      const filterValue = value.toLowerCase()
      this.clonesProviders = this.allProviders.filter((p: any) => p.content.name.toLowerCase().includes(filterValue))
    }
    if (!value) {
      this.clonesProviders = this.allProviders
    }
  }

  loadMore() {
    this.page = this.page + 1
    // this.getAllProvidersReq.request.offset = this.page * this.limit
    this.limit = (this.page * this.defaultLimit) || this.defaultLimit
    this.getAllProvidersReq.request.limit = this.limit
    this.getAllProviders()
    if ((this.page * this.defaultLimit) >= this.totalCount) {
      this.disableLoadMore = true
    } else {
      this.disableLoadMore = false
    }
  }

}
