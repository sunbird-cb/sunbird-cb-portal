// Core imports
import { Component, OnDestroy, OnInit, Inject } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { Router } from '@angular/router'
import { HttpErrorResponse } from '@angular/common/http'
import { MatTabChangeEvent, MatSnackBar } from '@angular/material'
// RxJS imports
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
// Project files and components
import { ConfigurationsService, MultilingualTranslationsService } from '@sunbird-cb/utils-v2'

import { WidgetUserServiceLib } from '@sunbird-cb/consumption'
import { NsContent } from '@sunbird-cb/collection/src/public-api'
import { TranslateService } from '@ngx-translate/core'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'ws-competency-list',
  templateUrl: './competency-list.component.html',
  styleUrls: ['./competency-list.component.scss'],
})

export class CompetencyListComponent implements OnInit, OnDestroy {

  isMobile = false
  toggleFilter = false
  skeletonArr = <any>[]
  showAll = false
  private destroySubject$ = new Subject()
  // not used so commenting these variables
  // three_month_back = new Date(new Date().setMonth(new Date().getMonth() - 3))
  // six_month_back = new Date(new Date().setMonth(new Date().getMonth() - 6))
  // one_year_back = new Date(new Date().setFullYear(new Date().getFullYear() - 1))
  showFilterIndicator = 'all'
  filteredData: any[] = []
  filterApplied = false

  TYPE_CONST = {
    behavioral: {
      capsValue: 'Behavioural',
      value: 'behavioural',
      otherValue: 'behavioral',
    },
    functional: {
      capsValue: 'Functional',
      value: 'functional',
    },
    domain: {
      capsValue: 'Domain',
      value: 'domain',
    },
  }

  competencyArray: any
  competency: any = {
    skeletonLoading: true,
    error: false,
    all: <any>[],
    allValue: 0,
    behavioural: <any>[],
    functional: <any>[],
    domain: <any>[],
  }

  leftCardDetails: any = [{
    name: this.TYPE_CONST.behavioral.value,
    label: this.TYPE_CONST.behavioral.capsValue,
    type: 'Behavioural',
    total: 0,
    competencySubTheme: 0,
    contentConsumed: 0,
    filter: {
      all: 0,
      threeMonths: 0,
      sixMonths: 0,
      lastYear: 0,
      threeMonthsSubTheme: 0,
      sixMonthsSubTheme: 0,
      lastYearSubTheme: 0,
    },
  }, {
    name: this.TYPE_CONST.functional.value,
    label: this.TYPE_CONST.functional.capsValue,
    type: this.TYPE_CONST.functional.capsValue,
    total: 0,
    competencySubTheme: 0,
    contentConsumed: 0,
    filter: {
      all: 0,
      threeMonths: 0,
      sixMonths: 0,
      lastYear: 0,
      threeMonthsSubTheme: 0,
      sixMonthsSubTheme: 0,
      lastYearSubTheme: 0,
    },
  }, {
    name: this.TYPE_CONST.domain.value,
    label: this.TYPE_CONST.domain.capsValue,
    type: this.TYPE_CONST.domain.capsValue,
    total: 0,
    competencySubTheme: 0,
    contentConsumed: 0,
    filter: {
      all: 0,
      threeMonths: 0,
      sixMonths: 0,
      lastYear: 0,
      threeMonthsSubTheme: 0,
      sixMonthsSubTheme: 0,
      lastYearSubTheme: 0,
    },
  }]

  filterObjData: any = {
    primaryCategory: [],
    status: [],
    timeDuration: [],
    competencyArea: [],
    competencyTheme: [],
    competencySubTheme: [],
    providers: [],
  }
  filterObjData2 = { ...this.filterObjData }
  tabValue = ''
  certificateMappedObject: any = {}
  compentencyKey!: NsContent.ICompentencyKeys
  constructor(
    private widgetService: WidgetUserServiceLib,
    private configService: ConfigurationsService,
    private router: Router,
    private matSnackBar: MatSnackBar,
    private langtranslations: MultilingualTranslationsService,
    private translate: TranslateService,
    private configSvc: ConfigurationsService,
    @Inject(DOCUMENT) private document: Document
  ) {
    if (window.innerWidth < 768) {
      this.isMobile = true
      this.skeletonArr = [1, 2, 3]
    } else {
      this.skeletonArr = [1, 2, 3, 4, 5, 6]
      this.showAll = true
      this.isMobile = false
    }
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
  }

  ngOnInit() {
    this.compentencyKey = this.configSvc.compentency[environment.compentencyVersionKey]
    this.getUserEnrollmentList()
  }

  getUserEnrollmentList(): void {

    let enrollmentMapData: any = {}
    const userId: any = this.configService && this.configService.userProfile && this.configService.userProfile.userId
    this.widgetService.fetchUserBatchList(userId)
      .pipe(takeUntil(this.destroySubject$))
      .subscribe(
        (response: any) => {
          let competenciesV5: any[] = []
          enrollmentMapData = this.widgetService.mapEnrollmentData(response)
          response.courses.forEach((eachCourse: any) => {
            // To eliminate In progress or Yet to start courses...
            if (enrollmentMapData[eachCourse.contentId].status !== 2) { return }
            if (eachCourse.content && eachCourse.content[this.compentencyKey.vKey]) {
              competenciesV5 = [...competenciesV5, ...eachCourse.content[this.compentencyKey.vKey]]
            }

            const courseDetails = {
              courseName: eachCourse.courseName.trim(),
              viewMore: false,
              batchId: eachCourse.batchId,
              contentId: eachCourse.contentId,
            }
            if (eachCourse.issuedCertificates.length) {
              // tslint: disable-next-line
              eachCourse.issuedCertificates = eachCourse.issuedCertificates.map((icObj: any) => {
                const nicObj = { ...icObj, ...courseDetails }
                return nicObj
              })
            } else {
              eachCourse.issuedCertificates.push(courseDetails)
            }
            if ((eachCourse.content[this.compentencyKey.vKey] && eachCourse.content[this.compentencyKey.vKey].length)) {
              const subThemeMapping: any = {}
              eachCourse.content[this.compentencyKey.vKey].forEach((v5Obj: any) => {
                if (this.certificateMappedObject[v5Obj[this.compentencyKey.vCompetencyTheme]]) {

                  // Certificate consumed logic...
                  eachCourse.issuedCertificates.forEach((certObj: any) => {
                    // tslint:disable-next-line: max-line-length
                    if (this.certificateMappedObject[v5Obj[this.compentencyKey.vCompetencyTheme]].certificate
                      .findIndex((_obj: any) => _obj.courseName === certObj.courseName) === -1) {
                      this.certificateMappedObject[v5Obj[this.compentencyKey.vCompetencyTheme]].certificate
                      .push(certObj)
                    }
                  })

                  // Content consumed logic...
                  if (this.certificateMappedObject[v5Obj[this.compentencyKey.vCompetencyTheme]].contentConsumed
                    .indexOf(eachCourse.courseName.trim()) === -1) {
                    this.certificateMappedObject[v5Obj[this.compentencyKey.vCompetencyTheme]].contentConsumed
                    .push(eachCourse.courseName.trim())

                    // Completed on logic...
                    this.certificateMappedObject[v5Obj[this.compentencyKey.vCompetencyTheme]].completedOn
                    .push(eachCourse.completedOn)
                  }

                } else {
                  this.certificateMappedObject[v5Obj[this.compentencyKey.vCompetencyTheme]] = {
                    certificate: eachCourse.issuedCertificates,
                    contentConsumed: [eachCourse.courseName],
                    subThemes: [],
                    completedOn: [eachCourse.completedOn],
                  }
                }

                // Sub theme mapping logic...
                if (subThemeMapping[v5Obj[this.compentencyKey.vCompetencyTheme]]) {
                  if (subThemeMapping[v5Obj[this.compentencyKey.vCompetencyTheme]]
                    .indexOf(v5Obj[this.compentencyKey.vCompetencySubTheme]) === -1) {
                    subThemeMapping[v5Obj[this.compentencyKey.vCompetencyTheme]]
                      .push(v5Obj[this.compentencyKey.vCompetencySubTheme])
                  }
                } else {
                  subThemeMapping[v5Obj[this.compentencyKey.vCompetencyTheme]] = []
                  subThemeMapping[v5Obj[this.compentencyKey.vCompetencyTheme]]
                    .push(v5Obj[this.compentencyKey.vCompetencySubTheme])
                }
              })
              for (const key in subThemeMapping) {
                if (subThemeMapping.hasOwnProperty(key)) {
                  this.certificateMappedObject[key].subThemes.push(subThemeMapping[key])
                }
              }
            }
          })

          competenciesV5.forEach((v5Obj: any) => {
            v5Obj.subTheme = []
            v5Obj.contentConsumed = []
            v5Obj.issuedCertificates = []
            // tslint:disable-next-line: max-line-length
            const competencyArea = (v5Obj[this.compentencyKey.vCompetencyArea].toLowerCase() === 'behavioral')
            ? 'behavioural' : v5Obj[this.compentencyKey.vCompetencyArea].toLowerCase()
            if (this.competency[competencyArea]
              .findIndex((obj: any) =>
                obj[this.compentencyKey.vCompetencyTheme] === v5Obj[this.compentencyKey.vCompetencyTheme]
              ) === -1) {
            this.competency[competencyArea].push(v5Obj)
          }

            this.competency[competencyArea].forEach((_obj: any) => {
              if (_obj[this.compentencyKey.vCompetencyTheme] === v5Obj[this.compentencyKey.vCompetencyTheme]) {
                if (_obj.subTheme.indexOf(v5Obj[this.compentencyKey.vCompetencySubTheme]) === -1) {
                  _obj.subTheme.push(v5Obj[this.compentencyKey.vCompetencySubTheme])
                  // tslint: disable-next-line: whitespace
                }
                // tslint: disable-next-line: whitespace
              }
            })
          })
          // tslint: disable-next-line
          this.competency.all = [...this.competency.behavioural, ...this.competency.functional, ...this.competency.domain]
          this.getOtherData()
          this.competency.all = this.competency.all.sort((a: any, b: any) => b.latest - a.latest)

          this.competencyArray = (this.isMobile) ? this.competency.all.slice(0, 3) : this.competency.all
          this.competency.skeletonLoading = false
        },
        (error: HttpErrorResponse) => {
          if (!error.ok) {
            this.matSnackBar.open('Unable to pull Enrollment list details!')
            this.competency.skeletonLoading = false
          }
        }
    )
  }

  getOtherData(): void {

    this.competency.all.forEach((allObj: any) => {
      allObj.issuedCertificates = this.certificateMappedObject[allObj[this.compentencyKey.vCompetencyTheme]].certificate
      allObj.contentConsumed = this.certificateMappedObject[allObj[this.compentencyKey.vCompetencyTheme]].contentConsumed
      allObj.courseSubThemes = this.certificateMappedObject[allObj[this.compentencyKey.vCompetencyTheme]].subThemes
      // tslint:disable-next-line: max-line-length
      allObj['latest'] = (this.certificateMappedObject[allObj[this.compentencyKey.vCompetencyTheme]].completedOn.length) ? Math.max(...this.certificateMappedObject[allObj[this.compentencyKey.vCompetencyTheme]].completedOn) : null

      this.leftCardDetails.forEach((_lObj: any) => {
        if (_lObj.type === allObj[this.compentencyKey.vCompetencyArea]) {
          _lObj[this.compentencyKey.vCompetencySubTheme] += allObj.subTheme.length
          _lObj.contentConsumed += allObj.contentConsumed.length
        }
      })
    })
  }

  handleLeftFilter(months: string): void {
    // Do not delete, need to work on this...
    // this.leftCardDetails.forEach((_obj: any) => {
    //   this.competency[`${_obj.name}Value`] = _obj.filter[months]
    //   if (months === 'all') {
    //     this.competency[`${_obj.name}SubTheme`] = _obj.competencySubTheme
    //   } else {
    //     this.competency[`${_obj.name}SubTheme`] = _obj.filter[`${months}SubTheme`]
    //   }
    // })
    this.showFilterIndicator = months
  }

  handleTabChange(event: MatTabChangeEvent): void {
    const param = event.tab.textLabel.toLowerCase()
    this.tabValue = param
    this.competencyArray = this.competency[param].sort((a: any, b: any) => b.latest - a.latest)
    this.filterObjData2 = { ...this.filterObjData }
  }

  handleShowAll(): void {
    this.showAll = !this.showAll
    this.competencyArray = (this.showAll) ? this.competency['all'] : this.competency['all'].slice(0, 3)
  }

  handleClick(param: string): void {
    this.competencyArray = (this.isMobile) ? this.competency[param].slice(0, 3) : this.competency[param]
  }

  handleViewMore(obj: any, flag?: string): void {
    obj.viewMore = flag ? false : true
  }

  handleNavigate(obj: any): void {
    localStorage.setItem('details_page', JSON.stringify(obj))
    this.router.navigate(['/page/competency-passbook/details'])
  }

  handleSearch(event: string, competencyTheme: string): void {
    // tslint:disable-next-line
    competencyTheme = competencyTheme.toLowerCase()
    // tslint:disable-next-line
    if (!this.competency[competencyTheme].length) return
    // tslint:disable-next-line: max-line-length
    this.competencyArray = (!event.length) ? this.competency[competencyTheme] : this.competency[competencyTheme].filter((obj: any) => obj[this.compentencyKey.vCompetencyTheme].toLowerCase().trim().includes(event.toLowerCase()))
  }

  // Filters related functionalities...
  handleFilter(event: boolean): void {
    this.toggleFilter = event
    if (event) {
      this.document.body.classList.add('overflow-hidden')
    } else {
      this.document.body.classList.remove('overflow-hidden')
    }
  }

  handleApplyFilter(event: any) {
    this.toggleFilter = false
    this.filterObjData = event
    this.document.body.classList.remove('overflow-hidden')
    this.filterData(event)
  }

  handleClearFilterObj(event: any) {
    this.filterObjData2 = event
    this.filterData(event)
    this.competencyArray = this.competency[this.tabValue || 'all']
  }

  filterData(filterValue: any) {
    let finalFilterValue: any = []
    // tslint:disable-next-line: max-line-length
    if (filterValue[this.compentencyKey.vCompetencyArea].length || filterValue[this.compentencyKey.vCompetencyTheme].length || filterValue[this.compentencyKey.vCompetencySubTheme].length) {
      let filterAppliedOnLocal = false
      this.filteredData = this.competency[this.tabValue || 'all']
      // tslint: disable-next-line: whitespace
      if (filterValue[this.compentencyKey.vCompetencyArea].length) {
        filterAppliedOnLocal = filterAppliedOnLocal ? true : false
        finalFilterValue = (filterAppliedOnLocal ? finalFilterValue : this.filteredData).filter((data: any) => {
          // tslint:disable-next-line: max-line-length
          if (filterValue[this.compentencyKey.vCompetencyArea].some((r: any) =>  data[this.compentencyKey.vCompetencyArea].toLowerCase().trim().includes((r.toLowerCase() === 'behavior') ? 'behavioural' : r.toLowerCase()))) {
            return data
          }
        })
        filterAppliedOnLocal = true
      }

      if (filterValue[this.compentencyKey.vCompetencyTheme].length) {
        filterAppliedOnLocal = filterAppliedOnLocal ? true : false
        finalFilterValue = (filterAppliedOnLocal ? finalFilterValue : this.filteredData).filter((data: any) => {
          return filterValue[this.compentencyKey.vCompetencyTheme].includes(data[this.compentencyKey.vCompetencyTheme])
          // tslint: disable-next-line: whitespace
        })
        // tslint: disable-next-line: whitespace
        filterAppliedOnLocal = true
        // tslint: disable-next-line: whitespace
      }
      if (filterValue[this.compentencyKey.vCompetencySubTheme].length) {
        filterAppliedOnLocal = filterAppliedOnLocal ? true : false
        finalFilterValue = (filterAppliedOnLocal ? finalFilterValue : this.filteredData).filter((data: any) => {
          const returnedValue = data.subTheme.filter((stName: any) => {
            return filterValue[this.compentencyKey.vCompetencySubTheme].includes(stName)
          })
          return (returnedValue.length) ? data : false
        })
        filterAppliedOnLocal = true
      }
      this.competencyArray = finalFilterValue
    } else {
      this.filterApplied = false
      finalFilterValue = this.competencyArray
    }
  }

  ngOnDestroy(): void {
    this.destroySubject$.unsubscribe()
  }

  translateLabels(label: string, type: any) {
    return this.langtranslations.translateLabel(label, type, '')
  }
}
