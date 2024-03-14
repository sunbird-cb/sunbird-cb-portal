// Core imports
import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { HttpErrorResponse } from '@angular/common/http'
import { jsPDF } from 'jspdf'
// RxJS imports
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
// Project files and components
import { CompetencyPassbookService } from '../competency-passbook.service'
import { TranslateService } from '@ngx-translate/core'
import { MultilingualTranslationsService } from '@sunbird-cb/utils/src/public-api'
import { environment } from 'src/environments/environment'
import { EventService, WsEvents } from '@sunbird-cb/utils'

@Component({
  selector: 'ws-competency-card-details',
  templateUrl: './competency-card-details.component.html',
  styleUrls: ['./competency-card-details.component.scss'],
})

export class CompetencyCardDetailsComponent implements OnInit, OnDestroy {
  private destroySubject$ = new Subject()
  params: any
  certificateData: any = []
  subThemeArray: any[] = []
  viewMoreST = false
  updatedTime: any
  themeDetails: any
  isMobile = false

  constructor(
    private actRouter: ActivatedRoute,
    private router: Router,
    private cpService: CompetencyPassbookService,
    private translate: TranslateService,
    private langtranslations: MultilingualTranslationsService,
    private events: EventService,
  ) {
    this.langtranslations.languageSelectedObservable.subscribe(() => {
      if (localStorage.getItem('websiteLanguage')) {
        this.translate.setDefaultLang('en')
        const lang = localStorage.getItem('websiteLanguage')!
        this.translate.use(lang)
      }
    })
    this.isMobile = (window.innerWidth < 768) ? true : false
    this.actRouter.queryParams.subscribe((params: any) => {
      this.params = params
    })
    // tslint: disable-next-line: whitespace
    if (localStorage.getItem('details_page') !== 'undefined') {
      const detailsData = JSON.parse(localStorage.getItem('details_page') as any)
      this.themeDetails = detailsData
      this.certificateData = detailsData.issuedCertificates
      this.certificateData.forEach((obj: any) => {
        obj.courseName = obj.courseName.charAt(0).toUpperCase() + obj.courseName.slice(1)
        if (obj.identifier) {
          obj['loading'] = true
          this.getCertificateSVG(obj)
          // tslint:disable-next-line: max-line-length
          this.updatedTime =  this.updatedTime ? (new Date(this.updatedTime) > new Date(obj.lastIssuedOn)) ? this.updatedTime : obj.lastIssuedOn : obj.lastIssuedOn
        }
      })
    }
  }

  ngOnInit() {}

  getCertificateSVG(obj: any): void {
    // tslint: disable-next-line
    this.cpService.fetchCertificate(obj.identifier)
      .pipe(takeUntil(this.destroySubject$))
      .subscribe(res => {
        // tslint: disable-next-line
        obj['printURI'] = res.result.printUri
        obj['loading'] = false
        // tslint: disable-next-line
      },         (error: HttpErrorResponse) => {
        if (!error.ok) {
          obj['loading'] = false
          obj['error'] = 'Failed to fetch Certificate'
        }
      })
  }

  async handleDownloadCertificatePDF(uriData: any): Promise<void> {
    const img = new Image()
    img.src = uriData
    img.width = 1820
    img.height = 1000
    img.onload = () => {
    // tslint:disable-next-line
      const canvas = document.createElement('canvas');
      [canvas.width, canvas.height] = [img.width, img.height]
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(img, 0, 0, img.width, img.height)
        // tslint:disable-next-line: max-line-length
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

  shareCertificate(certId: any) {
    this.raiseShareIntreactTelemetry(certId, 'share')
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${environment.contentHost}/apis/public/v8/cert/download/${certId}`
    return window.open(url, '_blank')
  }

  handleNavigate(courseObj: any): void {
    this.router.navigateByUrl(`app/toc/${courseObj.contentId}/overview?batchId=${courseObj.batchId}`)
  }

  handleViewMore(obj: any, flag?: string): void {
    obj.viewMore = flag ? false : true
  }

  ngOnDestroy(): void {
    this.destroySubject$.unsubscribe()
  }

  raiseShareIntreactTelemetry(certId?: string, type?: string, action?: string) {
    this.events.raiseInteractTelemetry(
      {
        type: WsEvents.EnumInteractTypes.CLICK,
        id: `${type}-${WsEvents.EnumInteractSubTypes.CERTIFICATE}`,
        subType: action && action,
      },
      {
        id: certId,   // id of the certificate
        type: WsEvents.EnumInteractSubTypes.CERTIFICATE,
      }
    )
  }

}
