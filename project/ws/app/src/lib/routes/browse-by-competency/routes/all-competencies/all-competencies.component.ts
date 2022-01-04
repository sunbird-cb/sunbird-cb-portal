import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core'
import { ConfigurationsService, EventService, WsEvents } from '@sunbird-cb/utils'
import { FormGroup, FormControl } from '@angular/forms'
import { BrowseCompetencyService } from '../../services/browse-competency.service'
import { NSBrowseCompetency } from '../../models/competencies.model'
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators'
import { Subject, Observable } from 'rxjs'
// tslint:disable
import _ from 'lodash'

@Component({
  selector: 'ws-app-all-competencies',
  templateUrl: './all-competencies.component.html',
  styleUrls: ['./all-competencies.component.scss'],
})
export class AllCompetenciesComponent implements OnInit, OnChanges {
  private unsubscribe = new Subject<void>()
  public displayLoader!: Observable<boolean>
  defaultThumbnail = ''
  allCompetencies!: NSBrowseCompetency.ICompetencie[]
  competencyAreas: any
  searchForm: FormGroup | undefined
  appliedFilters: any = []
  searchQuery: string = ''
  sortBy:any
  stateData: {
    param: any, path: any
  } | undefined
  // searchCompArea = new FormControl('')
  titles = [
    { title: 'Learn', url: '/page/learn', icon: 'school' },
    { title: 'All Competencies', url: 'none', icon: '' },
  ]

  compentency = 'some-competency'

  constructor(
    private configSvc: ConfigurationsService,
    private events: EventService,
    private browseCompServ: BrowseCompetencyService
  ) { }

  ngOnInit() {
    this.displayLoader = this.browseCompServ.isLoading()
    this.stateData = { param: '', path: 'all-competencies' }
    this.searchForm = new FormGroup({
      sortByControl: new FormControl(''),
      searchKey: new FormControl(''),
    })
    const instanceConfig = this.configSvc.instanceConfig
    if (instanceConfig) {
      this.defaultThumbnail = instanceConfig.logos.defaultContent || ''
    }
    this.searchForm.valueChanges
      .pipe(
        debounceTime(500),
        switchMap(async formValue => {
          this.sortBy = formValue.sortByControl
          this.updateQuery(formValue.searchKey)
        }),
        takeUntil(this.unsubscribe)
      ).subscribe()

    // if(this.searchForm.get('sortByControl')) {
    //   this.searchForm.get('sortByControl')!.valueChanges.pipe(
    //     debounceTime(500),
    //     takeUntil(this.unsubscribe)
    //   ).subscribe(val => {
    //     this.sortBy = val
    //   });
    // }

    // Fetch initial data
    this.searchCompetency('')

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.param.currentValue) {
      // this.getSearchedData()
    }
  }

  searchCompetency(searchQuery: any, filters?: any) {
    const searchJson = [
      { type: 'COMPETENCY', field: 'name', keyword: searchQuery ? searchQuery : '' },
      { type: 'COMPETENCY', field: 'description', keyword: searchQuery ? searchQuery : '' },
      // { type: 'COMPETENCY', field: 'competencyType', keyword: 'Behavioural' },
      { type: 'COMPETENCY', field: 'status', keyword: 'VERIFIED' },
    ]
    const filterJson = []
    if (filters && filters.length) {
      const groups = _.groupBy(filters, 'mainType')
      for (let key of Object.keys(groups)) {
        const filter = { field: key, values: [''] }
        const keywords = groups[key].map(x => x.name)
        filter.values = keywords
        filterJson.push(filter)
      }
    }
    const req = {
      searches: searchJson,
      filter: filterJson,
      sort: this.sortBy
    }
    this.browseCompServ
      .searchCompetency(req)
      .subscribe((reponse: NSBrowseCompetency.ICompetencieResponse) => {
        if (reponse.statusInfo && reponse.statusInfo.statusCode === 200) {
          this.allCompetencies = reponse.responseData
        }
      })
  }


  updateQuery(key: string) {
    this.searchQuery = key
    this.searchCompetency(this.searchQuery, this.appliedFilters)
  }

  reset() {
    // this.searchForm.setValue('searchKey') = ''
    this.searchCompetency('')
  }

  raiseTelemetry(content: any) {
    if (content) {
      this.events.raiseInteractTelemetry(
        {
          type: 'click',
          subType: `card-${content.primaryCategory || 'content'}`,
          // id: content.identifier || '',
        },
        {
          id: content.identifier || '',
          type: content.primaryCategory,
          // contentId: content.identifier || '',
          // contentType: content.primaryCategory,
          rollup: {},
          ver: `${content.version}${''}`,
        },
        {
          pageIdExt: 'knowledge-card',
          module: WsEvents.EnumTelemetrymodules.COMPETENCY,
      })
    }
  }

  applyFilter(filter: any) {
    if (filter) {
      this.appliedFilters = filter

      this.searchCompetency(this.searchQuery, this.appliedFilters)
      // const queryparam = this.searchRequestObject
    }
    console.log('Filter', filter)
  }

  removeFilter(filter: any) {
    // this.rfilter = filter
    this.browseCompServ.notifyOther(filter)
  }

  ngOnDestroy() {
    this.unsubscribe.next()
  }
}
