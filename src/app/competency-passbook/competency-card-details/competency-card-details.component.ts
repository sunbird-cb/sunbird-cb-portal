import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CompetencyPassbookService } from '../competency-passbook.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'ws-competency-card-details',
  templateUrl: './competency-card-details.component.html',
  styleUrls: ['./competency-card-details.component.scss']
})
export class CompetencyCardDetailsComponent implements OnInit, OnDestroy {
  private destroySubject$ = new Subject();
  params: any;
  stateData: any;
  constructor(
    private router: ActivatedRoute,
    private cpService: CompetencyPassbookService
  ) {
    this.router.queryParams.subscribe((params: any) => {
      this.params = params;
    });
    
    this.router.data.subscribe((_data: any) => {
      this.stateData = window.history.state
      console.log("this.stateData - ", this.stateData);
      this.stateData.certificate && this.stateData.certificate.forEach((obj: any) => {
        this.getCertificateSVG(obj);
      });
    })
  }

  ngOnInit() {}

  getCertificateSVG(obj: any): void {
    this.cpService.fetchCertificate(obj.identifier)
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((res) => {
        console.log('res - ', res);
        obj['printURI'] = res.result.printUri;
        console.log("obj - ", obj);
      }, (error: HttpErrorResponse) => {
        if(!error.ok) {
          obj['error'] = 'Failed to fetch Certificate';
        }
      });
  }

  ngOnDestroy(): void {
    this.destroySubject$.unsubscribe();
  }

}
