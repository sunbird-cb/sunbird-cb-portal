import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTabChangeEvent } from '@angular/material';

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

  constructor(
    private cpService: CompetencyPassbookService,
    private widgetService: WidgetUserService,
    private configService: ConfigurationsService
  ) { }

  ngOnInit() {
    this.fetchCompetencyList();
    this.getUserEnrollmentList();
  }

  getUserEnrollmentList(): void {
    const userId: any = this.configService && this.configService.userProfile && this.configService.userProfile.userId;
    this.widgetService.fetchUserBatchList(userId || 'b82aadca-f249-4962-841e-d82987d83b24')
      .pipe(takeUntil(this.destroySubject$))
      .subscribe(
        (response: any) => {
          let competenciesV5: any[] = [];
          response.courses.forEach((obj: any) => {
            if (obj.content && obj.content.competencies_v5) {
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
      return obj;
    });
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

            console.log("obj.name - ", obj.name);
            var abc = (obj.name === 'Behavioral' ? 'behavioural' : obj.name.toLowerCase())
            console.log('abc - ', abc);
            
            this.leftCardDetails.forEach((_eachObj: any) => {
              if(_eachObj.type.toLowerCase() === obj.name.toLowerCase()) {
                _eachObj.total = obj.children.length
              }
            });
          });
          this.competencyArray = this.competency.all;
          this.competency.skeletonLoading = false;
          console.log('this.leftCardDetails - ', this.leftCardDetails);
          
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

  ngOnDestroy(): void {
    this.destroySubject$.unsubscribe();
  }

}
