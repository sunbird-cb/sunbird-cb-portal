import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTabChangeEvent } from '@angular/material';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CompetencyPassbookService } from './../competency-passbook.service';
import { WidgetUserService } from '@sunbird-cb/collection/src/public-api';
import { ConfigurationsService } from '@sunbird-cb/utils/src/public-api';

@Component({
  selector: 'ws-competency-list',
  templateUrl: './competency-list.component.html',
  styleUrls: ['./competency-list.component.scss']
})

export class CompetencyListComponent implements OnInit, OnDestroy {

  private destroySubject$ = new Subject();

  competencyArray: any;
  competency: any = {
    skeletonLoading: false,
    error: false,
    all: <any>[],
    behavioural: <any>[],
    functional: <any>[],
    domain: <any>[]
  };

  leftCardDetails: any = [{
    name: 'behavioural',
    label: 'Behavioural',
    type: 'Behavioral',
    total: 0,
    competencySubTheme: 0,
    contentConsumed: 0
  },{
    name: 'functional',
    label: 'Functional',
    type: 'Functional',
    total: 0,
    competencySubTheme: 0,
    contentConsumed: 0
  }, {
    name: 'domain',
    label: 'Domain',
    type: 'Domain',
    total: 0,
    competencySubTheme: 0,
    contentConsumed: 0
  }];

  courseWithCompetencyArray: any[] = [];
  certificateMappedObject: any = {}; 

  constructor(
    private cpService: CompetencyPassbookService,
    private widgetService: WidgetUserService,
    private configService: ConfigurationsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getUserEnrollmentList();
  }

  getUserEnrollmentList(): void {
    const userId: any = this.configService && this.configService.userProfile && this.configService.userProfile.userId;
    this.widgetService.fetchUserBatchList(userId || 'b82aadca-f249-4962-841e-d82987d83b24')
      .pipe(takeUntil(this.destroySubject$))
      .subscribe(
        (response: any) => {
          this.fetchCompetencyList();

          let competenciesV5: any[] = [];
          response.courses.forEach((obj: any) => {
            if (obj.content && obj.content.competencies_v5) {
              this.courseWithCompetencyArray.push(obj);
              competenciesV5 = [...competenciesV5, ...obj.content.competencies_v5];
            }
          });
          
          competenciesV5.forEach((obj: any) => {
            this.leftCardDetails.forEach((_eachObj: any) => {
              if (_eachObj.type.toLowerCase() === obj.competencyArea.toLowerCase()) {
                _eachObj.contentConsumed += 1;
              }
            })
          });

        }, (error: HttpErrorResponse) => {
          if (!error.ok) {
            alert('Unable to pull Enrollment list details');
          }
        }
    )
  }

  bindMoreData(obj: any, name: string) {
    obj = obj.map((obj: any) => {
      obj['viewMore'] = false;
      obj['competencyName'] = name;

      this.leftCardDetails.forEach((_eachObj: any) => {
        if (_eachObj.name === name) {
          _eachObj.competencySubTheme += obj.children.length;
        }
      });

      this.courseWithCompetencyArray.forEach((eachCourse: any) => {
        if (eachCourse.issuedCertificates && eachCourse.issuedCertificates.length) {
          eachCourse.content.competencies_v5 && eachCourse.content.competencies_v5.forEach((cObj: any) => {
            eachCourse.issuedCertificates.forEach((eObj: any) => {
              eObj ['courseName'] = eachCourse.courseName
            });

            if (cObj.competencyTheme.toLowerCase().trim() === obj.name.toLowerCase().trim()) {
              if (this.certificateMappedObject[obj.name]) {
                this.certificateMappedObject[obj.name] = [...this.certificateMappedObject[obj.name], ...eachCourse.issuedCertificates]
              } else {
                this.certificateMappedObject[obj.name] = [];
                this.certificateMappedObject[obj.name] = eachCourse.issuedCertificates;
              }
            }
          })
        }
      });
      
      return obj;
    });

    console.log("this.certificateMappedObject - ", this.certificateMappedObject);
    return obj;
  }

  fetchCompetencyList(): void {
    this.competency.skeletonLoading = true;
    const payload = {
      "search": {
        "type": "Competency Area"
      },
      "filter": {
        "isDetail": true
      }
    };

    this.cpService.getCompetencyList(payload)
      .pipe(takeUntil(this.destroySubject$))
      .subscribe(
        (response: any) => {
          response.result.competency.forEach((obj: any) => {
            if (obj.name === 'Behavioral') {
              this.competency.behavioural = this.bindMoreData(obj.children, 'behavioural');
              this.competency.all = [...this.competency.all, ...this.competency.behavioural]
            } else if (obj.name === 'Functional') {
              this.competency.functional = this.bindMoreData(obj.children, obj.name.toLowerCase());
              this.competency.all = [...this.competency.all, ...this.competency.functional]
            } else {
              this.competency.domain = this.bindMoreData(obj.children, obj.name.toLowerCase());
              this.competency.all = [...this.competency.all, ...this.competency.domain]
            }
            
            this.leftCardDetails.forEach((_eachObj: any) => {
              if(_eachObj.type.toLowerCase() === obj.name.toLowerCase()) {
                _eachObj.total = obj.children.length
              }
            });
          });

          this.competencyArray = this.competency.all;
          this.competency.skeletonLoading = false;
        }, (error: HttpErrorResponse) => {
          if (!error.ok) {
            this.competency.error = true;
            this.competency.skeletonLoading = false;
          }
        }
      );
  }

  handleTabChange(event: MatTabChangeEvent ): void {
    const param = event.tab.textLabel.toLowerCase();
    this.competencyArray = this.competency[param];
  }

  handleClick(param: string): void {
    this.competencyArray = this.competency[param];
  }

  handleViewMore(obj: any, flag?: string): void {
    obj.viewMore = flag ? false : true;
  }

  handleNavigate(obj: any): void {
    const state =  {certificate: this.certificateMappedObject[obj.name]};
    this.router.navigate(['/page/competency-passbook/details'], {queryParams: {theme: obj.name, name: obj.competencyName}, state});
  }

  handleSearch(event: string, competencyTheme: string): void {
    competencyTheme = competencyTheme.toLowerCase()
    if (!this.competency[competencyTheme].length) return;
    this.competencyArray = (!event.length) ? this.competency[competencyTheme] : this.competency[competencyTheme].filter((obj: any) => obj.name.toLowerCase().trim().includes(event.toLowerCase()));
  }

  ngOnDestroy(): void {
    this.destroySubject$.unsubscribe();
  }

}
