import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
// import { Subject } from 'rxjs';

import { CompetencyPassbookService } from '../competency-passbook.service';
import { MatTabChangeEvent } from '@angular/material';

@Component({
  selector: 'ws-competency-list',
  templateUrl: './competency-list.component.html',
  styleUrls: ['./competency-list.component.scss']
})

export class CompetencyListComponent implements OnInit {

  competencyArray: any;
  competency: any = {
    all: <any>[],
    behavioral: <any>[],
    functional: <any>[],
    domain: <any>[]
  };

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
      return obj;
    })
    return obj;
  }

  fetchCompetencyList(): void {
    const payload = {
      "search": {
        "type": "Competency Area"
      },
      "filter": {
        "isDetail": true
      }
    };

    this.cpService.getCompetencyList(payload).subscribe(
      (response: any) => {
        response.result.competency.forEach((obj: any) => {
          if (obj.name === 'Behavioral') {
            this.competency.behavioral = this.bindMoreData(obj.children, obj.name.toLowerCase());
            this.competency.all = [...this.competency.all, ...this.competency.behavioral]
          } else if (obj.name === 'Functional') {
            this.competency.functional = this.bindMoreData(obj.children, obj.name.toLowerCase());
            this.competency.all = [...this.competency.all, ...this.competency.functional]
          } else {
            this.competency.domain = this.bindMoreData(obj.children, obj.name.toLowerCase());
            this.competency.all = [...this.competency.all, ...this.competency.domain]
          }          
        });
        this.competencyArray = this.competency.all;
      }, (error: HttpErrorResponse) => {
        if (!error.ok) {
          alert('Some issue!');
        }
      }
    )
  }


  handleTabChange(event: MatTabChangeEvent ): void {
    const param = event.tab.textLabel.toLowerCase();
    this.competencyArray = this.competency[param];
    console.log('this.competencyArray - ', this.competencyArray);
    
  }

  handleClick(param: string): void {
    this.competencyArray = this.competency[param];
  }

  handleViewMore(obj: any, flag?: string): void {
    obj.viewMore = flag ? false : true;
  }

}
