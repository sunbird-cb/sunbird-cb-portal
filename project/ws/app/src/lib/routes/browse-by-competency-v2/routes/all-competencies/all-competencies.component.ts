import { Component, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core'
import { ConfigurationsService, EventService, MultilingualTranslationsService, WsEvents } from '@sunbird-cb/utils-v2'
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms'
import { BrowseCompetencyService } from '../../services/browse-competency.service'
import { NSBrowseCompetency } from '../../models/competencies.model'
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators'
import { Subject, Observable } from 'rxjs'
import { NsContent } from '@sunbird-cb/collection/src/public-api'

// tslint:disable
import _ from 'lodash'
// tslint:enable
import { LocalDataService } from '../../services/localService'
import { TranslateService } from '@ngx-translate/core'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'ws-app-all-competencies',
  templateUrl: './all-competencies.component.html',
  styleUrls: ['./all-competencies.component.scss'],
})
export class AllCompetenciesComponent implements OnInit, OnDestroy, OnChanges {
  private unsubscribe = new Subject<void>()
  public displayLoader!: Observable<boolean>
  defaultThumbnail = ''
  allCompetencies!: NSBrowseCompetency.ICompetencie[]
  competencyAreas: any
  searchForm: UntypedFormGroup | undefined
  appliedFilters: any = []
  searchQuery = ''
  sortBy: any
  stateData: {
    param: any, path: any
  } | undefined
  // searchCompArea = new FormControl('')
  titles = [
    { title: 'Learn', url: '/page/learn', icon: 'school' },
    { title: 'All Competencies', url: 'none', icon: '' },
  ]

  compentency = 'some-competency'
  compentencyKey!: NsContent.ICompentencyKeys

  constructor(
    private configSvc: ConfigurationsService,
    private events: EventService,
    private browseCompServ: BrowseCompetencyService,
    private localDataService: LocalDataService,
    private langtranslations: MultilingualTranslationsService,
    private translate: TranslateService,
  ) {
    this.langtranslations.languageSelectedObservable.subscribe(() => {
      if (localStorage.getItem('websiteLanguage')) {
        this.translate.setDefaultLang('en')
        const lang = localStorage.getItem('websiteLanguage')!
        this.translate.use(lang)
      }
    })
  }

  ngOnInit() {
    this.compentencyKey = this.configSvc.compentency[environment.compentencyVersionKey]

    this.displayLoader = this.browseCompServ.isLoading()
    this.stateData = { param: '', path: 'all-competencies' }
    this.searchForm = new UntypedFormGroup({
      sortByControl: new UntypedFormControl(''),
      searchKey: new UntypedFormControl(''),
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

    if (this.compentencyKey.vKey === 'competencies_v5') {
      this.searchCompetency('')
    } else {
      this.searchCompetencyV2('')
    }

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.param.currentValue) {
      // this.getSearchedData()
    }
  }

  searchCompetency(searchQuery: any, filters?: any) {
    this.allCompetencies = []
    const searchJson = [
      { type: 'COMPETENCY', field: 'name', keyword: searchQuery ? searchQuery : '' },
      { type: 'COMPETENCY', field: 'description', keyword: searchQuery ? searchQuery : '' },
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

  searchCompetencyV2(searchQuery: any, filters?: any) {
    this.allCompetencies = []
    const searchJson = [
      { type: 'COMPETENCY', field: 'name', keyword: searchQuery ? searchQuery : '' },
      { type: 'COMPETENCY', field: 'description', keyword: searchQuery ? searchQuery : '' },
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
        .searchCompetencyV2(req)
        .subscribe(async (reponse: any) => {
          // if (reponse.statusInfo && reponse.statusInfo.statusCode === 200) {
          //   this.allCompetencies = reponse.responseData
          // }
          const data: NSBrowseCompetency.ICompetencie[] = await this.flattenCompetencies(reponse.result.content)
          if (data) {
            // this.allCompetencies
            if (req && req.filter && req.filter.length > 0) {
              _.each(data, r => {
                _.each(req.filter, f => {
                  if (_.includes(f.values, _.get(r, f.field))) {
                    this.allCompetencies.push(r)
                  }
                })
              })
              // this.allCompetencies = _.orderBy(this.allCompetencies, ['name'], [req.sort === 'Descending'])
            } else {
              this.allCompetencies = data
            }
            this.localDataService.initData(data)
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

        this.allCompetencies = _.uniqBy(this.allCompetencies, 'id')

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

  flattenCompetencies(data: NSBrowseCompetency.ICompetencyV2[]): Promise<NSBrowseCompetency.ICompetencie[]> {
    return new Promise((resolve, reject) => {
      try {
        const result: any[] = []

        function traverse(node: NSBrowseCompetency.ICompetencyV2, parentCompetencyType: string, parentCompetencyArea: string) {
          // Push the transformed node
          result.push({
            name: node.displayName || node.name,
            id: node.identifier,
            description: node.description,
            type: parentCompetencyType,
            status: '',
            source: '',
            competencyType: parentCompetencyType.charAt(0).toUpperCase() + parentCompetencyType.slice(1).toLowerCase(),
            competencyArea: parentCompetencyArea,
            contentCount: node.count,
          })

          // Recursively process children if present
          if (node.children && node.children.length > 0) {
            node.children.forEach(child => traverse(child, parentCompetencyType, parentCompetencyArea))
          }
        }

        data.forEach(item => {
          if (item.identifier.includes('competencyarea')) {
            const competencyType = item.displayName || item.name

            item.children.forEach(area => {
              if (area.identifier.includes('fw_theme')) {
                const competencyArea = area.displayName || area.name

                area.children.forEach(subtheme => {
                  if (subtheme.identifier.includes('subtheme')) {
                    traverse(subtheme, competencyType, competencyArea)
                  }
                })
              }
            })
          }
        })

        resolve(result)
      } catch (error) {
        reject(error)
      }
    })
  }

  updateQuery(key: string) {
    this.searchQuery = key
    if (this.compentencyKey.vKey === 'competencies_v5') {
      this.searchCompetency(this.searchQuery, this.appliedFilters)
    } else {
      this.searchCompetencyV2(this.searchQuery, this.appliedFilters)
    }
  }

  reset() {
    // this.searchForm.setValue('searchKey') = ''
    if (this.compentencyKey.vKey === 'competencies_v5') {
      this.searchCompetency('')
    } else {
      this.searchCompetencyV2('')
    }
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
  get allComp() {
    return this.allCompetencies
  }
  applyFilter(filter: any) {
    if (filter) {
      this.appliedFilters = filter

      if (this.compentencyKey.vKey === 'competencies_v5') {
        this.searchCompetency(this.searchQuery, this.appliedFilters)
      } else {
        this.searchCompetencyV2(this.searchQuery, this.appliedFilters)
      }
      // const queryparam = this.searchRequestObject
    }
    // console.log('Filter', filter)
  }

  removeFilter(filter: any) {
    // this.rfilter = filter
    this.browseCompServ.notifyOther(filter)
  }

  ngOnDestroy() {
    this.unsubscribe.next()
  }
}
