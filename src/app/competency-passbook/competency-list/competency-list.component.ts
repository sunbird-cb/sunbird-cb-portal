import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';

import { CompetencyPassbookService } from '../competency-passbook.service';

@Component({
  selector: 'ws-competency-list',
  templateUrl: './competency-list.component.html',
  styleUrls: ['./competency-list.component.scss']
})

export class CompetencyListComponent implements OnInit {


  constructor(
    private cpService: CompetencyPassbookService
  ) { }

  ngOnInit() {

    this.fetchCompetencyList()
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
      (_res: any) => {
        console.log('res - ', _res);
      }, (error: HttpErrorResponse) => {
        if (!error.ok) {
          alert('Some issue!');
        }
      }
    )
  }

}
