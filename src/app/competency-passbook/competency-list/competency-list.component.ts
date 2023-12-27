import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTabChangeEvent } from '@angular/material';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CompetencyPassbookService } from './../competency-passbook.service';

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
    total: 0,
    competencySubTheme: 0,
    contentConsumed: 0
  },{
    name: 'functional',
    label: 'Functional',
    total: 0,
    competencySubTheme: 0,
    contentConsumed: 0
  }, {
    name: 'domain',
    label: 'Domain',
    total: 0,
    competencySubTheme: 0,
    contentConsumed: 0
  }];

  constructor(
    private cpService: CompetencyPassbookService
  ) { }

  ngOnInit() {
    this.fetchCompetencyList()
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
              if(_eachObj.name === (obj.name === 'Behavioral') ? 'behavioural' : obj.name.toLowerCase()) {
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
