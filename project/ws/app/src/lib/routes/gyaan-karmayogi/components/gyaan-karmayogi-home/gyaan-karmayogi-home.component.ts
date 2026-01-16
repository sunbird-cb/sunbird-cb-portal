
import { Component, OnInit } from '@angular/core'
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import * as _ from 'lodash'
import { gyaanConstants } from '../../models/gyaan-contants.model'
import { GyaanKarmayogiService } from '../../services/gyaan-karmayogi.service'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'ws-app-gyaan-karmayogi-home',
  templateUrl: './gyaan-karmayogi-home.component.html',
  styleUrls: ['./gyaan-karmayogi-home.component.scss'],
})
export class GyaanKarmayogiHomeComponent implements OnInit {
  stripData: any
  pageConfig: any
  pageConfigData: any
  facetsdata: any
  hideAllStrip = false
  sectorNames: any = []
  searchControl = new UntypedFormControl('')
  selectedSector: any = gyaanConstants.allSectors
  categories: any = [{
    name: gyaanConstants.allCategories,
  }]
  subSector: any = [{
    name: gyaanConstants.allSubSector,
  }]
  subSectorDefault: any = [{
    name: gyaanConstants.allSubSector,
  }]
  sectorsList = [
  {
    name: gyaanConstants.allSectors,
  }]

  gyaanForm: UntypedFormGroup | undefined

  selectedTabIndex = 0
  cbcOrg: any
  nonCbcOrgids: any = []
  contentTabEmptyResponseCount = 0

  constructor(public translate: TranslateService,
              private route: ActivatedRoute,
              private router: Router,
              private seeAllSvc: GyaanKarmayogiService) {
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
  }

  ngOnInit() {
    this.gyaanForm = new UntypedFormGroup({
      sectors: new UntypedFormControl(''),
      subSectors: new UntypedFormControl(''),
      category: new UntypedFormControl(''),
    })
    this.pageConfig = (this.route.parent && this.route.parent.snapshot.data)
    this.pageConfigData = this.pageConfig.pageData.data
    this.stripData = JSON.parse(JSON.stringify((this.route.parent && this.route.parent.snapshot.data.pageData.data.stripConfig))) || []
    this.facetsdata = this.pageConfig.gyaanData.facets.data
    if (this.facetsdata && this.facetsdata.length) {
      this.factesAssign(this.facetsdata)
    }
    const addFilters: any = {}
    if (this.selectedSector === gyaanConstants.allSectors) {
      addFilters[gyaanConstants.requestSectorName] = this.sectorNames
    }
    if (this.sectorNames.length) {

      this.callStrips(addFilters)
    }
  }

  // this method is used for multi-lingual
  translateLetMenuName(menuName: string): string {
    // tslint:disable-next-line: prefer-template
    const translationKey = 'gyaanKarmayogi.' + menuName.replace(/\s/g, '')
    return this.translate.instant(translationKey)
  }

  // the below method is uded to hide strips and show strips
  hideAndCallStrip() {
    this.hideAllStrip = true
    setTimeout(() => {
      this.hideAllStrip = false
    },         gyaanConstants.timeOutDuration)
  }

  // this method is called when user clicks on apply button and if particular category is not selected
  // and it is called on selection of sectors
  callStrips(addFilters?: any) {
    const localStripData: any = []
    this.categories.forEach((cat: any) => {
      if (!cat.name.includes('All')) {
        if (this.route.parent && this.route.parent.snapshot.data.pageData.data.stripConfig) {
          const data = JSON.parse(JSON.stringify(this.route.parent &&
            this.route.parent.snapshot.data.pageData.data.stripConfig))

          if (data.strips.length) {
            data.strips[0].title = cat.name
            data.strips[0].key = cat.name
            data.strips[0].viewMoreUrl.queryParams.key = cat.name
            data.strips[0].viewMoreUrl.queryParams.content = this.selectedTabIndex === 0 ? 'agkCaseStudies' : 'otherResources'
            data.strips[0].titleDescription = cat.name
            data.strips[0].request.searchV6.request['limit'] = gyaanConstants.limitCount

            data.strips[0].request.searchV6.request.filters = {
                ...data.strips[0].request.searchV6.request.filters,
                resourceCategory: cat.name,

            }
            if (addFilters) {
              data.strips[0].request.searchV6.request.filters = {
                ...data.strips[0].request.searchV6.request.filters,
                ...addFilters,
              }
            }

            if (this.selectedTabIndex === 0 && cat.name === 'case study') {
              data.strips[0].request.searchV6.request.filters.contentType = [
                'Resource',
                'Course',
              ]
              data.strips[0].request.searchV6.request.filters.createdFor = this.selectedTabIndex === 0
                ? environment.cbcOrg : this.nonCbcOrgids
            }  else {
              data.strips[0].request.searchV6.request.filters.contentType = [
                'Resource',
              ]
              data.strips[0].request.searchV6.request.filters = {
                ...data.strips[0].request.searchV6.request.filters,
                ...addFilters,
                createdFor: this.selectedTabIndex === 0 ? environment.cbcOrg : this.nonCbcOrgids,
              }
            }
            if (this.searchControl && this.searchControl.value) {
              data.strips[0].request.searchV6.request.query = this.searchControl.value
            }
          }

          localStripData.push(data)
        }

      }
    })
    this.hideAndCallStrip()
    this.stripData = localStripData
  }

  // this method is called when user clicks on apply button from ui
  applyFilter(form: UntypedFormGroup) {
    const addFilters: any = {}
    this.contentTabEmptyResponseCount = 0

    if (form.value.sectors && form.value.sectors.name !== gyaanConstants.allSectors) {
      addFilters[gyaanConstants.requestSectorName] = form.value.sectors.name
    } else {
      addFilters[gyaanConstants.requestSectorName] = this.sectorNames
    }
    if (form.value.subSectors && form.value.subSectors !== gyaanConstants.allSubSector) {
      addFilters[gyaanConstants.requestSubSectorName] = form.value.subSectors
    }
    if (form.value.category && form.value.category !== gyaanConstants.allCategories) {
      addFilters[gyaanConstants.resourceCategory] = form.value.category
    }
    if (form.value.sectors && form.value.subSectors && form.value.category) {
      this.callPaticualrStrip(addFilters)
    } else {
      if (form.value.sectors || form.value.subSectors || form.value.category) {
        if (!form.value.category) {
          this.callStrips(addFilters)
        } else {
          this.callPaticualrStrip(addFilters)
        }
      }

    }
  }

  // this method is called on selection of category to call particular strip into the ui
  callPaticualrStrip(addFilters: any) {
      if (addFilters.resourceCategory) {
        const data = JSON.parse(JSON.stringify(this.route.parent && this.route.parent.snapshot.data.pageData.data.stripConfig))
        if (data.strips.length) {
          data.strips[0].title = addFilters.resourceCategory
          data.strips[0].key = addFilters.resourceCategory
          data.strips[0].viewMoreUrl.queryParams.key = addFilters.resourceCategory
          data.strips[0].titleDescription = addFilters.resourceCategory
          data.strips[0].request.searchV6.request['limit'] = gyaanConstants.limitCount
          data.strips[0].request.searchV6.request.filters = {
              ...data.strips[0].request.searchV6.request.filters,
              resourceCategory: addFilters.resourceCategory,
          }
          if (addFilters) {
              data.strips[0].request.searchV6.request.filters = {
                ...data.strips[0].request.searchV6.request.filters,
                ...addFilters,
            }
          }
        }
        if (this.selectedTabIndex === 0 && addFilters.resourceCategory === 'case study') {
          data.strips[0].request.searchV6.request.filters.contentType = [
            'Resource',
            'Course',
          ]
          data.strips[0].request.searchV6.request.filters.createdFor = this.selectedTabIndex === 0
            ? environment.cbcOrg : this.nonCbcOrgids
        }  else {
          data.strips[0].request.searchV6.request.filters.contentType = [
            'Resource',
          ]
          data.strips[0].request.searchV6.request.filters = {
            ...data.strips[0].request.searchV6.request.filters,
            ...addFilters,
            createdFor: this.selectedTabIndex === 0 ? environment.cbcOrg : this.nonCbcOrgids,
          }
        }
        this.hideAllStrip = true

        this.stripData = [data]
    setTimeout(() => {
      this.hideAllStrip = false
    },         gyaanConstants.timeOutDuration)
      }
  }

  // this method is used for getting random color for the sector options
  getRandomColor() {
    const items = gyaanConstants.colorConstants
    const item = items[Math.floor(Math.random() * items.length)]
    return item
  }

  // this method is triggered on selection of sectors
  sectorFilter(sectorData: any, type?: string) {
    this.contentTabEmptyResponseCount = 0
    this.searchControl.setValue('')
    const addFilters: any = {}

    if (sectorData && type) {
      addFilters[gyaanConstants.requestSectorName] = this.sectorNames
    } else {
      addFilters[gyaanConstants.requestSectorName] = sectorData.name
    }
    this.selectedSector = sectorData.name
    if (this.gyaanForm) {
      this.gyaanForm.reset()
    }
    this.callStrips(addFilters)
  }

  // global search method
  searchFilter() {
    const addFilters: any = {
      [gyaanConstants.requestSectorName]: this.sectorNames,
    }
    this.contentTabEmptyResponseCount = 0
    this.callStrips(addFilters)
    this.selectedSector = gyaanConstants.allSectors
    if (this.gyaanForm) {
      this.gyaanForm.reset()
    }
  }

  // on change of sector dropdown will call this method
  sectorChange(event: any) {
    const addFilter: any = {}
    if (event.value && event.value.name === gyaanConstants.allSectors) {
      this.subSector = this.subSectorDefault
      this.selectedSector = gyaanConstants.allSectors
    } else {
      addFilter[gyaanConstants.requestSectorName] = event.value.name
      this.selectedSector = event.value.name
    }
    this.callFacetApi(addFilter)
  }

  // on change of subsector dropdown will call this method
  subSectorChange(event: any) {
    
    const addFilter: any = {}
    if (event && event.value === gyaanConstants.allSubSector) {
      this.categories = this.categories
    } else {
      if (this.gyaanForm) {
        if (this.gyaanForm.value.sectors.name !== gyaanConstants.allSectors) {
          addFilter[gyaanConstants.requestSectorName] = this.gyaanForm.value.sectors.name
        }
      }
      addFilter[gyaanConstants.requestSubSectorName] = event.value
    }
    this.callFacetApi(addFilter)
  }

  // method is usd for call api and get all facets having data in system
  callFacetApi(addFilter: any) {
    const request: any = {
      'request': {
        'filters': {
            'status': [
                'Live',
            ],
            ...addFilter,
        },
        'fields': [
            'identifier',
            'courseCategory',
            'status',
        ],
        'offset': 0,
        'limit': 0,
        'sort_by': {
            'lastUpdatedOn': 'desc',
        },
        'facets': [
            gyaanConstants.resourceCategory,
            gyaanConstants.requestSubSectorName,
        ],
    },
    }
    this.seeAllSvc.searchV6(request).subscribe((res: any) => {
        if (res.result.facets && res.result.facets.length) {
          this.factesAssign(res.result.facets)
        }
      },                                       (_error: any) => {
    })
  }

  // the below method is used for alligen the values to sector , subsector, aand category
  factesAssign(factesData: any) {
    if (factesData && factesData.length) {
      factesData.forEach((ele: any) => {
        if (ele.name === 'createdFor') {
          this.nonCbcOrgids = []
          ele.values.map((item: any) => {
            if (item.name !== this.cbcOrg) {
              this.nonCbcOrgids.push(item.name)
            }
          })
        }
        if (ele.name === gyaanConstants.requestSubSectorName) {
          this.subSector = ele.values
        }
        if (ele.name === gyaanConstants.requestSectorName) {
          ele.values.forEach((sec: any) => {
            sec['identifier'] = sec.name
          })
          this.sectorNames = ele.values.map((sectorName: any) => sectorName.name)
          const data: any = _.intersectionBy(this.pageConfig.gyaanData.sector.data, ele.values, (item: any) => _.toLower(item.name))
          data.forEach((sector: any) => {
            sector['bgColor'] = this.getRandomColor()
          })
          this.sectorsList = [...this.sectorsList, ...data]
        }
        if (ele.name === gyaanConstants.resourceCategory)  {
          let catFinalList: any = []
          if (this.pageConfig.pageData
            && this.pageConfig.pageData.data
            && this.pageConfig.pageData.data.allowedCategories) {
              catFinalList = ele.values.filter((catInfo: any) => this.pageConfig.pageData.data.allowedCategories.includes(catInfo.name))
            }
          this.categories = [...catFinalList]
        }
      })

    }
  }
// viewAllSector method is used to move to view all page
  viewAllSector() {
    this.router.navigate([`/app/amrit-gyaan-kosh/view-all`], {
      queryParams : {
        sector: this.selectedSector,
        // preview: true
        // key: 'case study',
        content: this.selectedTabIndex === 0 ? 'agkCaseStudies' : 'otherResources',
      },
    })
  }

  handleTabChange(event: any) {
    this.contentTabEmptyResponseCount = 0
    this.selectedTabIndex = event.index
    this.callStrips()
    // if( this.gyaanForm) {
    // this.applyFilter(this.gyaanForm)
    // }
  }
  openForm() {
    window.open('https://forms.gle/J4hQoCTRovzuo1AdA')
  }

  hideContentStrip(event: any) {
    if (event) {
      this.contentTabEmptyResponseCount = this.contentTabEmptyResponseCount + 1
    }
  }
}
