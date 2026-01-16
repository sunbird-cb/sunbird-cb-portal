import { Component, OnInit, OnDestroy } from '@angular/core'
import { BrowseCompetencyService } from '../../services/browse-competency.service'
import { NSBrowseCompetency } from '../../models/competencies.model'
// tslint:disable
import _ from 'lodash'
import { ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { ValueService } from '@sunbird-cb/utils-v2'
import { LocalDataService } from '../../services/localService';

@Component({
  selector: 'ws-app-competency-details',
  templateUrl: './competency-details.component.html',
  styleUrls: ['./competency-details.component.scss'],
})
export class CompetencyDetailsComponent implements OnInit, OnDestroy {
  private paramSubscription: Subscription | null = null
  public displayLoader!: Observable<boolean>
  competencyData: any
  filteroptions: any = []
  userFilters: any = []
  myFilterArray: any = []
  primaryCategoryType: any = []
  contentType: any = [] // now using as primaryCategory
  mimeType: any = []
  sourceType: any = []
  mediaType: any = []
  filterForm: UntypedFormGroup | undefined
  facets: any
  titles = [
    { title: 'Learn', url: '/page/learn', icon: 'school' },
    { title: 'All Competencies', url: '/app/learn/browse-by/competency', icon: '' },
  ]
  competencyName = ''
  courses: any[] = []
  searchReq: any
  myAppliedFilters: any = []
  sideNavBarOpened = true
  private defaultSideNavBarOpenedSubscription: any
  public screenSizeIsLtMedium = false
  isLtMedium$ = this.valueSvc.isLtMedium$


  stateData: {
    param: any, path: any
  } | undefined
  currentComp!: NSBrowseCompetency.ICompetencie | undefined
  constructor(
    private browseCompServ: BrowseCompetencyService,
    private valueSvc: ValueService,
    private activatedRoute: ActivatedRoute,
    private localService: LocalDataService,
  ) {
    this.searchReq = { ...this.activatedRoute.snapshot.data.searchPageData.data.search.searchReq }
    this.facets = this.activatedRoute.snapshot.data.searchPageData.data.search.defaultsearch || []
  }

  ngOnInit() {
    this.displayLoader = this.browseCompServ.isLoading()
    this.filterForm = new UntypedFormGroup({
      filters: new UntypedFormControl(''),
    })
    this.paramSubscription = this.activatedRoute.params.subscribe(async params => {
      this.competencyName = _.get(params, 'competency')
      const allComp = this.localService.compentecies.getValue()
      this.currentComp = _.first(_.filter(allComp, { 'name': this.competencyName }))
      this.titles.push({ title: this.competencyName, url: 'none', icon: '' })
      this.stateData = { param: this.competencyName, path: 'competency-details' }
    })

    this.defaultSideNavBarOpenedSubscription = this.isLtMedium$.subscribe(isLtMedium => {
      this.sideNavBarOpened = !isLtMedium
      this.screenSizeIsLtMedium = isLtMedium

    })

    this.formatFacets()

    // Fetch initial data
    // this.searchCompetency()
    if(!this.currentComp) {
      this.searchCompetencyV2()
    }
    this.getCbps()

  }

  formatFacets() {
    this.facets.forEach((nf: any) => {
      if (nf.name === 'mimeType') {
        const values: any = []
        nf.values.forEach((nfv: any) => {
          const nv = {
            count: '',
            name: '',
          }
          if (nfv.name !== 'video/mp4' && nfv.name !== 'video/x-youtube' && nfv.name !== 'application/json' &&
            nfv.name !== 'application/x-mpegURL' && nfv.name !== 'application/quiz' && nfv.name !== 'image/jpeg' &&
            nfv.name !== 'image/png' && nfv.name !== 'application/vnd.ekstep.html-archive' &&
            nfv.name !== 'application/vnd.ekstep.ecml-archive') {
            values.push(nfv)
          } else {
            if (nfv.name === 'video/mp4' || nfv.name === 'video/x-youtube' || nfv.name === 'application/x-mpegURL') {
              nv.name = 'Video'
              const indx = values.filter((x: any) => x.name === nv.name)
              if (indx.length === 0) {
                values.push(nv)
              }
            }
            if (nfv.name === 'application/json' || nfv.name === 'application/quiz') {
              nv.name = 'Assessment'
              const indx = values.filter((x: any) => x.name === nv.name)
              if (indx.length === 0) {
                values.push(nv)
              }
            }
            if (nfv.name === 'image/jpeg' || nfv.name === 'image/png') {
              nv.name = 'Image'
              const indx = values.filter((x: any) => x.name === nv.name)
              if (indx.length === 0) {
                values.push(nv)
              }
            }
            if (nfv.name === 'application/vnd.ekstep.html-archive' || nfv.name === 'application/vnd.ekstep.ecml-archive') {
              nv.name = 'Interactive Content'
              const indx = values.filter((x: any) => x.name === nv.name)
              if (indx.length === 0) {
                values.push(nv)
              }
            }
          }
        })
        nf.values = values
      }
      if (nf.name === 'source') {
        nf.values.sort((a: any, b: any) => {
          const textA = a.name.toUpperCase()
          const textB = b.name.toUpperCase()
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
        })
      }
    })
    this.filteroptions = this.facets
  }

  searchCompetency(_filters?: any) {
    const searchJson = [
      { type: 'COMPETENCY', field: 'name', keyword: this.competencyName ? this.competencyName : '' },
      { type: 'COMPETENCY', field: 'status', keyword: 'VERIFIED' },
    ]
    const req = {
      searches: searchJson,
    }
    this.browseCompServ
      .searchCompetency(req)
      .subscribe((response: NSBrowseCompetency.ICompetencieResponse) => {
        if (response.statusInfo && response.statusInfo.statusCode === 200) {
          // console.log('response.responseData :: ', response.responseData)
          if (response.responseData && response.responseData.length) {
            this.competencyData = response.responseData[0]
          }
        }
      })
  }

  searchCompetencyV2(_filters?: any) {
    const searchJson = [
      { type: 'COMPETENCY', field: 'name', keyword: this.competencyName ? this.competencyName : '' },
      { type: 'COMPETENCY', field: 'status', keyword: 'VERIFIED' },
    ]
    const req = {
      searches: searchJson,
    }
    this.browseCompServ
      .searchCompetency(req)
      .subscribe((response: any) => {
          // console.log('response :: ', response)
            if (response) {
              this.competencyData = _.first(_.filter(response, { 'name': this.competencyName }))
            }
      })
  }

  getCbps() {
    // if (this.myAppliedFilters.length === 0) {
    //   this.searchReq = this.activatedRoute.snapshot.data.searchPageData.data.search.searchReq
    // }
    this.searchReq.request.filters['competencies_v3.name'].splice(0, 1, this.competencyName)
    this.browseCompServ.fetchSearchData(this.searchReq).subscribe((res: any) => {
      if (res && res.result && res.result) {
        this.courses = res.result.content || []
      }
      if (res && res.result && res.result && res.result.facets) {
        // this.facets = res.result.facets
        this.primaryCategoryType = []
        this.contentType = []
        this.mimeType = []
        this.sourceType = []
        this.mediaType = []
        this.getFacets(res.result.facets)
        // this.formatFacets()
      }
    })
  }

  getFacets(facets: any) {
    facets.forEach((item: any) => {
      this.facets.forEach((fitem: any) => {
        if (item.name === fitem.name && item.name === 'source') {
          fitem.values = item.values
          fitem.values.forEach((val: any) => {
            const ispresent = this.userFilters.filter((x: any) => x.name === val.name)
            if (ispresent.length > 0) {
              val.ischecked = true
            } else {
              val.ischecked = false
            }
          })
        }
      })
    })
    this.filteroptions = this.facets
    this.formatFacets()
  }

  getFilterName(fil: any) {
    return this.userFilters.filter((x: any) => x.name === fil.name)
  }

  modifyUserFilters(fil: any, mainparentType: any) {
    const filters = this.getFilterName(fil)
    if (filters.length > 0) {
      this.userFilters.forEach((fs: any, index: number) => {
        if (fs.name === fil.name) {
          this.userFilters.splice(index, 1)
        }
      })
      this.myFilterArray.forEach((fs: any, index: number) => {
        if (fs.name === fil.name) {
          this.myFilterArray.splice(index, 1)
        }
      })
      this.filteroptions.forEach((fas: any) => {
        if (fas.name === mainparentType) {
          fas.values.forEach((fasv: any) => {
            if (fasv.name === fil.name) {
              fasv.ischecked = false
            }
          })
        }
      })
      this.applyFilter(this.myFilterArray)
    } else {
      this.userFilters.push(fil)

      const reqfilter = {
        mainType: mainparentType,
        name: fil.name,
        count: fil.count,
        ischecked: true,
      }
      this.filteroptions.forEach((fas: any) => {
        if (fas.name === mainparentType) {
          fas.values.forEach((fasv: any) => {
            if (fasv.name === fil.name) {
              fasv.ischecked = true
            }
          })
        }
      })
      this.myFilterArray.push(reqfilter)
      // this.appliedFilter.emit(this.myFilterArray)
      this.applyFilter(this.myFilterArray)
    }
  }

  getText(val: string) {
    return _.startCase(val || '')
  }

  applyFilter(filter: any) {
    if (filter && filter.length > 0) {
      const queryparam = this.searchReq
      queryparam.request.filters.primaryCategory = []
      queryparam.request.filters.contentType = []
      queryparam.request.filters.mimeType = []
      queryparam.request.filters.source = []
      filter.forEach((mf: any) => {
        if (mf.mainType === 'contentType') {
          // const indx = this.contentType.filter((x: any) => x === mf.name)
          // if (indx.length === 0) {
          //   this.contentType.push(mf.name)
          //   queryparam.request.filters.contentType = this.contentType
          // }
          // queryparam.request.filters.contentType = this.contentType
          const indx = this.primaryCategoryType.filter((x: any) => x === mf.name)
          if (indx.length === 0) {
            this.primaryCategoryType.push(mf.name)
            queryparam.request.filters.primaryCategory = this.primaryCategoryType
          }
          queryparam.request.filters.primaryCategory = this.primaryCategoryType
        } else if (mf.mainType === 'primaryCategory') {
          const indx = this.primaryCategoryType.filter((x: any) => x === mf.name)
          if (indx.length === 0) {
            this.primaryCategoryType.push(mf.name)
            queryparam.request.filters.primaryCategory = this.primaryCategoryType
          }
          queryparam.request.filters.primaryCategory = this.primaryCategoryType
        } else if (mf.mainType === 'mimeType') {
          if (mf.name === 'Image') {
            this.mimeType.push('image/jpeg')
            this.mimeType.push('image/png')
          } else if (mf.name === 'Video') {
            this.mimeType.push('video/mp4')
            this.mimeType.push('video/x-youtube')
            this.mimeType.push('application/x-mpegURL')
          } else if (mf.name === 'Assessment') {
            this.mimeType.push('application/json')
            this.mimeType.push('application/quiz')
          } else if (mf.name === 'Interactive Content') {
            this.mimeType.push('application/vnd.ekstep.html-archive')
            this.mimeType.push('application/vnd.ekstep.ecml-archive')
          } else {
            this.mimeType.push(mf.name)
          }
          queryparam.request.filters.mimeType = this.mimeType
        } else if (mf.mainType === 'source') {
          this.sourceType.push(mf.name)
          queryparam.request.filters.source = this.sourceType
        } else if (mf.mainType === 'mediaType') {
          this.mediaType.push(mf.name)
          queryparam.request.filters.mediaType = this.mediaType
        }
      })
      if (queryparam.request.filters.primaryCategory.length === 0) {
        this.primaryCategoryType.push('Course')
        // this.primaryCategoryType.push('Learning Resource')
        this.primaryCategoryType.push('Program')
        queryparam.request.filters.primaryCategory = this.primaryCategoryType
      }
      // this.facets = []
      // this.searchResults = []
      // this.totalResults = 0
      // this.newQueryParam = queryparam
      this.searchReq = queryparam
      this.getCbps()

    } else {
      this.myAppliedFilters = filter
      this.resetFilters()
      this.getCbps()
    }
  }

  resetFilters() {
    this.searchReq = { ...this.activatedRoute.snapshot.data.searchPageData.data.search.searchReq }
    this.searchReq.request.filters.source = []
    this.searchReq.request.filters.primaryCategory = []
  }

  ngOnDestroy() {
    if (this.paramSubscription) {
      this.paramSubscription.unsubscribe()
    }

    if (this.defaultSideNavBarOpenedSubscription) {
      this.defaultSideNavBarOpenedSubscription.unsubscribe()
    }
  }


}
