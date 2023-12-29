// Core imports
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { jsPDF } from 'jspdf'
// RxJS imports
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// Project files and components
import { CompetencyPassbookService } from '../competency-passbook.service';

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
      this.stateData.certificate && this.stateData.certificate.forEach((obj: any) => {
        obj['loading'] = true;
        this.getCertificateSVG(obj);
      });
    })
  }

  ngOnInit() {}

  getCertificateSVG(obj: any): void {
    this.cpService.fetchCertificate(obj.identifier)
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((res) => {
        obj['printURI'] = res.result.printUri;
        obj['loading'] = false;
      }, (error: HttpErrorResponse) => {
        if(!error.ok) {
          obj['loading'] = false;
          obj['error'] = 'Failed to fetch Certificate';
        }
      });
  }

  async handleDownloadCertificatePDF(uriData: any): Promise<void> {
    const img = new Image()
    img.src = uriData
    img.width = 1820
    img.height = 1000
    img.onload = () => {
      const canvas = document.createElement('canvas');
      [canvas.width, canvas.height] = [img.width, img.height]
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(img, 0, 0, img.width, img.height)
        const quality = 1.0 // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingQuality
        const dataImg = canvas.toDataURL('application/pdf', quality)
        const pdf = new jsPDF('landscape', 'px', 'a4')

        // add the image to the PDF
        pdf.addImage(dataImg, 10, 20, 600, 350)

        // download the PDF
        pdf.save('Certificate.pdf')
      }
    }
  }

  ngOnDestroy(): void {
    this.destroySubject$.unsubscribe();
  }

}
