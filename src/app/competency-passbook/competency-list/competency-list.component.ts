// Core imports
import { Component, OnDestroy, OnInit, Inject } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { Router } from '@angular/router'
import { HttpErrorResponse } from '@angular/common/http'
import { MatTabChangeEvent } from '@angular/material'
import { MatSnackBar } from '@angular/material'
// RxJS imports
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
// Project files and components
import { ConfigurationsService } from '@sunbird-cb/utils/src/public-api'
import { WidgetUserService } from '@sunbird-cb/collection/src/public-api'

@Component({
  selector: 'ws-competency-list',
  templateUrl: './competency-list.component.html',
  styleUrls: ['./competency-list.component.scss']
})

export class CompetencyListComponent implements OnInit, OnDestroy {

  isMobile: boolean = false;
  toggleFilter: boolean = false;
  skeletonArr = <any>[];
  showAll = false;
  private destroySubject$ = new Subject();
  three_month_back = new Date(new Date().setMonth(new Date().getMonth() - 3));
  six_month_back = new Date(new Date().setMonth(new Date().getMonth() - 6));
  one_year_back = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
  showFilterIndicator: string = 'all';
  filteredData: any[] = [];
  filterApplied: boolean = false;

  TYPE_CONST = {
    behavioral: {
      capsValue: 'Behavioural',
      value: 'behavioural',
      otherValue: 'behavioral'
    },
    functional: {
      capsValue: 'Functional',
      value: 'functional'
    },
    domain: {
      capsValue: 'Domain',
      value: 'domain'
    }
  }

  competencyArray: any;
  competency: any = {
    skeletonLoading: true,
    error: false,
    all: <any>[],
    allValue: 0,
    behavioural: <any>[],
    functional: <any>[],
    domain: <any>[]
  };

  leftCardDetails: any = [{
    name: this.TYPE_CONST.behavioral.value,
    label: this.TYPE_CONST.behavioral.capsValue,
    type: 'Behavioral',
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
      lastYearSubTheme: 0
    }
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
      lastYearSubTheme: 0
    }
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
      lastYearSubTheme: 0
    }
  }];

  filterObjData: any = {
    "primaryCategory":[],
    "status":[],
    "timeDuration":[], 
    "competencyArea": [], 
    "competencyTheme": [], 
    "competencySubTheme": [], 
    "providers": [] 
  };
  certificateMappedObject: any = {};

  constructor(
    private widgetService: WidgetUserService,
    private configService: ConfigurationsService,
    private router: Router,
    private matSnackBar: MatSnackBar,
    @Inject(DOCUMENT) private document: Document
  ) { 
    if (window.innerWidth < 768) {
      this.isMobile = true;
      this.skeletonArr = [1, 2, 3];
    } else {
      this.skeletonArr = [1, 2, 3, 4, 5, 6];
      this.showAll = true;
      this.isMobile = false;
    }
  }

  ngOnInit() {
    this.getUserEnrollmentList();
  }

  getUserEnrollmentList(): void {
    const userId: any = this.configService && this.configService.userProfile && this.configService.userProfile.userId;
    this.widgetService.fetchUserBatchList(userId)
      .pipe(takeUntil(this.destroySubject$))
      .subscribe(
        (response: any) => {
          let competenciesV5: any[] = [];

          response.courses.forEach((eachCourse: any) => {
            if (eachCourse.content && eachCourse.content.competencies_v5) {
              competenciesV5 = [...competenciesV5, ...eachCourse.content.competencies_v5];
            }

            if ((eachCourse.content.competencies_v5 && eachCourse.content.competencies_v5.length)) {

              eachCourse.issuedCertificates.forEach((icObj: any) => {
                icObj['courseName'] = eachCourse.courseName;
                icObj['viewMore'] = false;
                icObj['batchId'] = eachCourse.batchId;
                icObj['contentId'] = eachCourse.contentId;
              });

              let subThemeMapping: any = {};
              eachCourse.content.competencies_v5.forEach((v5Obj: any) => {
                if (this.certificateMappedObject[v5Obj.competencyTheme]) {

                  // Certificate consumed logic...
                  eachCourse.issuedCertificates.forEach((certObj: any) => {
                    if (this.certificateMappedObject[v5Obj.competencyTheme].certificate.findIndex((_obj: any) => _obj.identifier === certObj.identifier) === -1) {
                      this.certificateMappedObject[v5Obj.competencyTheme].certificate.push(certObj);
                    }
                  });

                  // Content consumed logic...
                  if (this.certificateMappedObject[v5Obj.competencyTheme].contentConsumed.indexOf(eachCourse.courseName.trim()) === -1) {
                    this.certificateMappedObject[v5Obj.competencyTheme].contentConsumed.push(eachCourse.courseName.trim());
                  }
                } else {
                  this.certificateMappedObject[v5Obj.competencyTheme] = {
                    'certificate': eachCourse.issuedCertificates,
                    'contentConsumed': [eachCourse.courseName],
                    'subThemes': []
                  };
                }

                // Sub theme mapping logic...
                if (subThemeMapping[v5Obj.competencyTheme]) {
                  if (subThemeMapping[v5Obj.competencyTheme].indexOf(v5Obj.competencySubTheme) === -1) {
                    subThemeMapping[v5Obj.competencyTheme].push(v5Obj.competencySubTheme);
                  }
                } else {
                  subThemeMapping[v5Obj.competencyTheme] = [];
                  subThemeMapping[v5Obj.competencyTheme].push(v5Obj.competencySubTheme);
                }
              });
              
              for (let key in subThemeMapping) {
                this.certificateMappedObject[key].subThemes.push(subThemeMapping[key])
              }
            }
          });
          
          competenciesV5.forEach((v5Obj: any) => {
            v5Obj.subTheme = [];
            v5Obj.contentConsumed = [];
            v5Obj.issuedCertificates = [];
            const competencyArea = (v5Obj.competencyArea.toLowerCase() === 'behavioral') ? 'behavioural' : v5Obj.competencyArea.toLowerCase();
            if (this.competency[competencyArea].findIndex((obj: any) => obj.competencyTheme === v5Obj.competencyTheme ) === -1) {
              this.competency[competencyArea].push(v5Obj);
            }

            this.competency[competencyArea].forEach((_obj: any) => {
              if (_obj.competencyTheme === v5Obj.competencyTheme) {
                if (_obj.subTheme.indexOf(v5Obj.competencySubTheme) === -1) {
                  _obj.subTheme.push(v5Obj.competencySubTheme);
                }
              }
            });
          });
          
          this.competency.all = [...this.competency.behavioural, ...this.competency.functional, ...this.competency.domain];
          this.competencyArray = this.competency.all;

          this.getOtherData();
          this.competency.skeletonLoading = false;
        }, (error: HttpErrorResponse) => {
          if (!error.ok) {
            this.matSnackBar.open("Unable to pull Enrollment list details!");
            this.competency.skeletonLoading = false;
          }
        }
    )
  }

  getOtherData(): void {
    this.competency.all.forEach((allObj: any) => {
      allObj.issuedCertificates = this.certificateMappedObject[allObj.competencyTheme].certificate;
      allObj.contentConsumed = this.certificateMappedObject[allObj.competencyTheme].contentConsumed;
      allObj.courseSubThemes = this.certificateMappedObject[allObj.competencyTheme].subThemes;

      this.leftCardDetails.forEach((_lObj: any) => {
        if (_lObj.type === allObj.competencyArea) {
          _lObj.competencySubTheme += allObj.subTheme.length;
          _lObj.contentConsumed += allObj.contentConsumed.length;
        }
      });
    });
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
    // });
    this.showFilterIndicator = months;
  }

  handleTabChange(event: MatTabChangeEvent ): void {
    const param = event.tab.textLabel.toLowerCase();
    this.competencyArray = this.competency[param];
  }

  handleShowAll(): void {
    this.showAll = !this.showAll;
    this.competencyArray = (this.showAll) ? this.competency['all'] : this.competency['all'].slice(0, 3); 
  }

  handleClick(param: string): void {
    this.competencyArray = (this.isMobile) ? this.competency[param].slice(0, 3) : this.competency[param];
  }

  handleViewMore(obj: any, flag?: string): void {
    obj.viewMore = flag ? false : true;
  }

  handleNavigate(obj: any): void {
    localStorage.setItem('details_page', JSON.stringify(obj));
    this.router.navigate(['/page/competency-passbook/details']);
  }

  handleSearch(event: string, competencyTheme: string): void {
    competencyTheme = competencyTheme.toLowerCase()
    if (!this.competency[competencyTheme].length) return;
    this.competencyArray = (!event.length) ? this.competency[competencyTheme] : this.competency[competencyTheme].filter((obj: any) => obj.competencyTheme.toLowerCase().trim().includes(event.toLowerCase()));
  }

  // Filters related functionalities...
  handleFilter(event: boolean): void {
    this.toggleFilter = event;
    this.document.body.classList.add('overflow-hidden')
  }

  handleApplyFilter(event: any){
    this.toggleFilter = false
    this.filterObjData = event
    this.filterData(event)
  }

  handleClearFilterObj(event: any){
    this.filterObjData = event;
    this.filterData(event);
  }

  filterData(filterValue: any) {
    let finalFilterValue: any = [];
    this.document.body.classList.remove('overflow-hidden');
    if( filterValue['competencyArea'].length || filterValue['competencyTheme'].length || filterValue['competencySubTheme'].length ) {
      let filterAppliedOnLocal = false;
      this.filteredData = this.competency['all'];

      if(filterValue['competencyArea'].length) {
        filterAppliedOnLocal = filterAppliedOnLocal ? true : false
        finalFilterValue = (filterAppliedOnLocal ? finalFilterValue : this.filteredData).filter((data: any) => {
          if(filterValue['competencyArea'].some((r: any) =>  data.competencyArea.toLowerCase().trim().includes(r.toLowerCase()))) {
            return data 
          }
        })
        filterAppliedOnLocal = true;
      }

      if(filterValue['competencyTheme'].length) {
        filterAppliedOnLocal = filterAppliedOnLocal ? true : false
        finalFilterValue = (filterAppliedOnLocal ? finalFilterValue : this.filteredData).filter((data: any) => {
          return filterValue['competencyTheme'].includes(data.competencyTheme);
        })
        filterAppliedOnLocal = true;
      }

      if(filterValue['competencySubTheme'].length) {
        filterAppliedOnLocal = filterAppliedOnLocal ? true : false
        finalFilterValue = (filterAppliedOnLocal ? finalFilterValue : this.filteredData).filter((data: any) => {
          let returnedValue = data.subTheme.filter((stName: any) => { 
            return filterValue['competencySubTheme'].includes(stName)
          })
          return (returnedValue.length) ? data : false;
        })
        filterAppliedOnLocal = true;
      }

      this.competencyArray = finalFilterValue;
    } else {
      this.filterApplied = false;
      finalFilterValue = this.competencyArray;
    }
  }

  ngOnDestroy(): void {
    this.destroySubject$.unsubscribe();
  }

}
