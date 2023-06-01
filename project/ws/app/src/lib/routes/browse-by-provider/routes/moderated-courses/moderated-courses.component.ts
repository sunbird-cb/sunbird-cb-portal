import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
// tslint:disable
import _ from 'lodash'
import { Subject } from 'rxjs'
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators'
import { NSBrowseCompetency } from '../../../browse-by-competency/models/competencies.model'
import { LocalDataService } from '../../../browse-by-competency/services/localService'
import { BrowseCompetencyService } from '../../../browse-by-competency/services/browse-competency.service'
import { ValueService } from '@sunbird-cb/utils'
import { NSSearch } from '@sunbird-cb/collection'
import { SearchApiService } from '@sunbird-cb/collection/src/lib/_services/search-api.service'

// tslint:enable
@Component({
  selector: 'ws-app-moderated-courses',
  templateUrl: './moderated-courses.component.html',
  styleUrls: ['./moderated-courses.component.scss'],
})
export class ModeratedCoursesComponent implements OnInit, OnDestroy {
  titles = [
    { title: 'Learn', url: '/page/learn', icon: 'school' },
    { title: 'Moderated courses', url: 'none', icon: '' },
  ]
  searchForm: FormGroup | undefined
  sortBy: any
  searchQuery = ''
  private unsubscribe = new Subject<void>()
  appliedFilters: any = []
  allCompetencies!: NSBrowseCompetency.ICompetencie[]
  sideNavBarOpened = true
  isLtMedium$ = this.valueSvc.isLtMedium$
  defaultSideNavBarOpenedSubscription: any
  public screenSizeIsLtMedium = false
  searchResults: any
  totalResults: any
  paramFilters: any
  totalpages: any
  scrollDistance = 0.2
  throttle = 100

  constructor(
    private localDataService: LocalDataService,
    private browseCompServ: BrowseCompetencyService,
    private valueSvc: ValueService,
    private searchApiService: SearchApiService
  ) { }

  ngOnInit() {
    this.searchForm = new FormGroup({
      sortByControl: new FormControl(''),
      searchKey: new FormControl(''),
    })

    this.searchForm.valueChanges
    .pipe(
      debounceTime(500),
      switchMap(async formValue => {
        this.sortBy = formValue.sortByControl
        this.updateQuery(formValue.searchKey)
      }),
      takeUntil(this.unsubscribe)
    ).subscribe()

    this.defaultSideNavBarOpenedSubscription = this.isLtMedium$.subscribe(isLtMedium => {
      this.sideNavBarOpened = !isLtMedium
      this.screenSizeIsLtMedium = isLtMedium
    })
    this.getModeratedData()
  }

  ngOnDestroy() {
    if (this.defaultSideNavBarOpenedSubscription) {
      this.defaultSideNavBarOpenedSubscription.unsubscribe()
    }
  }

  public getModeratedData() {
    const moderatedCoursesRequestBody: NSSearch.ISearchV6RequestV3 = {
      request: {
        secureSettings: true,
        query: '',
        filters: {
            primaryCategory: [
                'Course',
            ],
            status: [
                'Live',
            ],
        },
        sort_by: {
            lastUpdatedOn: 'desc',
        },
        facets: [
            'mimeType',
        ],
        limit : 20,
      },
    }

   this.searchApiService.getSearchV6Results(moderatedCoursesRequestBody).subscribe(response => {
    this.searchResults = response.result.content
    this.totalResults = response.result.count
    this.paramFilters = []
    this.totalpages = Math.ceil(this.totalResults / 100)
   })
  }

  updateQuery(key: string) {
    this.searchQuery = key
    this.searchCompetency(this.searchQuery, this.appliedFilters)
  }

  searchCompetency(searchQuery: any, filters?: any) {
    this.allCompetencies = []
    const searchJson = [
      { type: 'COMPETENCY', field: 'name', keyword: searchQuery ? searchQuery : '' },
      { type: 'COMPETENCY', field: 'description', keyword: searchQuery ? searchQuery : '' },
      // { type: 'COMPETENCY', field: 'competencyType', keyword: 'Behavioural' },
      { type: 'COMPETENCY', field: 'status', keyword: 'VERIFIED' },
    ]
    const filterJson = []
    if (filters && filters.length) {
      const groups = _.groupBy(filters, 'mainType')
      for (const key of Object.keys(groups)) {
        const filter: { field: string, values: string[] } = { field: key, values: [''] }
        const keywords = groups[key].map(x => x.name)
        filter.values = keywords
        filterJson.push(filter)
      }
    }
    const req = {
      searches: searchJson,
      filter: filterJson,
      sort: this.sortBy,
    }
    if (!(this.localDataService.compentecies.value
      && this.localDataService.compentecies.getValue().length > 0)) {
      this.browseCompServ
        .searchCompetency(req)
        .subscribe((reponse: NSBrowseCompetency.ICompetencie[]) => {
          // if (reponse.statusInfo && reponse.statusInfo.statusCode === 200) {
          //   this.allCompetencies = reponse.responseData
          // }
          if (reponse) {
            // this.allCompetencies
            if (req && req.filter && req.filter.length > 0) {
              _.each(reponse, r => {
                _.each(req.filter, f => {
                  if (_.includes(f.values, _.get(r, f.field))) {
                    this.allCompetencies.push(r)
                  }
                })
              })
              // this.allCompetencies = _.orderBy(this.allCompetencies, ['name'], [req.sort === 'Descending'])
            } else {
              this.allCompetencies = reponse
            }
            this.localDataService.initData(reponse)
          }
        })
    } else {
      const data = this.localDataService.compentecies.getValue()
      if (data && req && req.filter && req.filter.length > 0) {
        _.each(data, r => {
          _.each(req.filter, f => {
            if (_.includes(f.values, _.get(r, f.field))) {
              this.allCompetencies.push(r)
            }
          })
        })
        if (req.sort) {
          this.allCompetencies = _.orderBy(this.allCompetencies, ['name'], [req.sort === 'Descending' ? 'desc' : 'asc'])
        }
      } else {
        const fData: NSBrowseCompetency.ICompetencie[] = []
        if (req.searches && req.searches.length > 0) {
          _.each(data, (d: NSBrowseCompetency.ICompetencie) => {
            let found = false
            _.each(_.initial(req.searches), s => {
              found = found || _.includes(_.lowerCase(_.get(d, s.field)), _.lowerCase(s.keyword))
            })
            if (found) {
              fData.push(d)
            }
          })
          this.allCompetencies = fData
        }
        if (req.sort) {
          this.allCompetencies = _.orderBy(fData || data, ['name'], [req.sort === 'Descending' ? 'desc' : 'asc'])
        } else {
          this.allCompetencies = fData || data
        }
      }
    }
  }

  applyFilter(filter: any) {
    if (filter) {
      this.appliedFilters = filter
      this.searchCompetency(this.searchQuery, this.appliedFilters)
    }
  }

  onScrollEnd() {
  }
}
