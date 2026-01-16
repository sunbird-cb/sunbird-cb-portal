import { Component, OnInit } from '@angular/core'
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms'
import { Observable, Subject } from 'rxjs'
import { BrowseProviderService } from '../../browse-by-provider/services/browse-provider.service'
import { LocalDataService } from '../../browse-by-competency/services/localService'
import { TranslateService } from '@ngx-translate/core'
import { EventService, WsEvents, MultilingualTranslationsService } from '@sunbird-cb/utils-v2'
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators'
// tslint:disable
import _ from 'lodash'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'ws-app-karma-programs',
  templateUrl: './karma-programs.component.html',
  styleUrls: ['./karma-programs.component.scss']
})
export class KarmaProgramsComponent implements OnInit {

  public displayLoader!: Observable<boolean>
  provider = 'JPAL'
  page = 1
  defaultLimit = 20
  limit = 20
  searchForm: UntypedFormGroup | undefined
  sortBy: any
  searchQuery = ''
  allProviders: any = []
  clonesProviders: any
  disableLoadMore = false
  totalCount = 0
  private unsubscribe = new Subject<void>()
  titles = [
    { title: 'Learn', url: '/page/learn', icon: 'school', disableTranslate: false },
    { title: 'Karma Programs', url: 'none', icon: '' },
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
    private route: ActivatedRoute,
    private langtranslations: MultilingualTranslationsService,
    private events: EventService
  ) {
    this.langtranslations.languageSelectedObservable.subscribe(() => {
      if (localStorage.getItem('websiteLanguage')) {
        this.translate.setDefaultLang('en')
        const lang = localStorage.getItem('websiteLanguage')!
        this.translate.use(lang)
      }
    })
    if (this.route.snapshot.data && this.route.snapshot.data.programData
      && this.route.snapshot.data.programData.data
      && this.route.snapshot.data.programData.data.result
      && this.route.snapshot.data.programData.data.result.data
      && this.route.snapshot.data.programData.data.result.data.length
    ) {
      // this.allProviders = this.route.snapshot.data.programData.data.result.data
      this.allProviders = []
      let programData: any = this.route.snapshot.data.programData.data.result.data
      programData.forEach((prgData: any) => {
        if(prgData.children && prgData.children.length) {
          this.allProviders.push(prgData)
        }
      })
      // .data.result.form.data.sectionList
    }
    this.clonesProviders = this.allProviders
   }

  ngOnInit() {
    this.searchForm = new UntypedFormGroup({
      sortByControl: new UntypedFormControl(''),
      searchKey: new UntypedFormControl(''),
    })
    this.sortType('asc')
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
          const res = _.toArray(_.pickBy(response, v => v !== null && v !== undefined && !!v.title))
          const fData: any[] = []
          if (this.searchQuery) {
            _.each(res, (d: any) => {
              let found = false
              found = _.includes(_.lowerCase(this.searchQuery), _.lowerCase(_.get(d, 'title')))
                || _.includes(_.lowerCase(_.get(d, 'title')), _.lowerCase(this.searchQuery))
              if (found) {
                fData.push(d)
              }
            })
            this.allProviders = fData
          }
          if (this.sortBy) {
            this.allProviders = _.orderBy(fData.length ? fData : res, ['title'], [this.sortBy])
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
      data = _.toArray(_.pickBy(data, v => v !== null && v !== undefined && !!v.title))
      if (this.searchQuery) {
        _.each(data, (d: any) => {
          let found = false
          found = _.includes(_.lowerCase(this.searchQuery), _.lowerCase(_.get(d, 'title')))
            || _.includes(_.lowerCase(_.get(d, 'title')), _.lowerCase(this.searchQuery))
          if (found) {
            fData.push(d)
          }
        })
        this.allProviders = fData
      }
      if (this.sortBy) {
        this.allProviders = _.orderBy((fData.length ? fData : data), ['title'], [this.sortBy])
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
      this.clonesProviders = this.allProviders.filter((p: any) => p.title.toLowerCase().includes(filterValue))
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

  sortType(sortType: any){
    if(this.searchForm && this.searchForm.get('sortByControl')){
      // tslint:disable-next-line: no-non-null-assertion
      this.searchForm.get('sortByControl')!.setValue(sortType)
      this.sortBy = sortType;
      this.allProviders = _.orderBy(this.allProviders.length ? this.allProviders : this.allProviders, ['title'], [this.sortBy])
    }
  }

  raiseTelemetryInteratEvent(event: any) {
    this.events.raiseInteractTelemetry(
      {
        type: 'click',
        subType: 'karma-programs',
        id: 'card-content',
      },
      {
        id: event.title,
        type: event.orgId,
      },
      {
        module: WsEvents.EnumTelemetrymodules.LEARN,
      }
    )
  }

}
