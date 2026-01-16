// Core imports
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { HttpErrorResponse } from '@angular/common/http'
import { jsPDF } from 'jspdf'
// RxJS imports
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
// Project files and components
import { CompetencyPassbookService } from '../competency-passbook.service'
import { TranslateService } from '@ngx-translate/core'
import { MultilingualTranslationsService, EventService, WsEvents, ConfigurationsService  } from '@sunbird-cb/utils-v2'
import { environment } from 'src/environments/environment'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { CertificateDialogComponent } from '@sunbird-cb/collection/src/lib/_common/certificate-dialog/certificate-dialog.component'
import { NsContent } from '@sunbird-cb/collection/src/public-api'

@Component({
  selector: 'ws-competency-card-details',
  templateUrl: './competency-card-details.component.html',
  styleUrls: ['./competency-card-details.component.scss'],
})

export class CompetencyCardDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  private destroySubject$ = new Subject()
  params: any
  certificateData: any = []
  subThemeArray: any[] = []
  viewMoreST = false
  updatedTime: any
  themeDetails: any
  isMobile = false
  detailsData: any
  @ViewChildren('courseName') courseNameDiv!: QueryList<ElementRef>
  compentencyKey!: NsContent.ICompentencyKeys
  constructor(
    private actRouter: ActivatedRoute,
    private router: Router,
    private cpService: CompetencyPassbookService,
    private translate: TranslateService,
    private langtranslations: MultilingualTranslationsService,
    private events: EventService,
    private dialog: MatDialog,
    private configSvc: ConfigurationsService,
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
    if (localStorage.getItem('details_page') !== '' && localStorage.getItem('details_page') !== 'undefined') {
      this.detailsData = JSON.parse(localStorage.getItem('details_page') as any)
      if (this.detailsData) {
        this.themeDetails = this.detailsData
        this.certificateData = this.detailsData.issuedCertificates
        this.certificateData.forEach((obj: any) => {
          obj.courseName = obj.courseName.charAt(0).toUpperCase() + obj.courseName.slice(1)
          if (obj.identifier) {
            obj['loading'] = false
            // this.getCertificateSVG(obj)
            this.updatedTime =  this.updatedTime ? (new Date(this.updatedTime) > new Date(obj.lastIssuedOn)) ?
            this.updatedTime : obj.lastIssuedOn : obj.lastIssuedOn
          }
        })
      }
    }
  }

  ngOnInit() {
    this.compentencyKey = this.configSvc.compentency[environment.compentencyVersionKey]
  }

  ngAfterViewInit(): void {
    this.courseNameDiv.forEach((_elem: ElementRef, index: number) => {
      if (_elem.nativeElement.getBoundingClientRect().height >= 48) {
        this.detailsData.issuedCertificates[index]['courseEllipsis'] = true
      }
    })
  }

  getCertificateSVG(obj: any, type?: string): void {
    // tslint: disable-next-line
        obj['loading'] = true
        if (obj && obj.printURI) {
          if (type === 'DOWNLOAD') {
            this.handleDownloadCertificatePDF(obj.printURI)
          }
          if (type === 'SHARE') {
            this.shareCertificate(obj.identifier)
          }
          obj['loading'] = false
        } else {
          this.cpService.fetchCertificate(obj.identifier)
          .pipe(takeUntil(this.destroySubject$))
          .subscribe(res => {
            // tslint: disable-next-line
            obj['printURI'] = res.result.printUri
            obj['loading'] = false
            this.dialog.open(CertificateDialogComponent, {
              width: '1200px',
              data: { cet: res.result.printUri, certId: obj.identifier },
            })
          },         (error: HttpErrorResponse) => {
            if (!error.ok) {
              obj['loading'] = false
              obj['error'] = 'Failed to fetch Certificate'
            }
          })
        }
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

  raiseShareIntreactTelemetry(certId?: string, type?: string, action?: string) {
    this.events.raiseInteractTelemetry(
      {
        type: WsEvents.EnumInteractTypes.CLICK,
        id: `${type}-${WsEvents.EnumInteractSubTypes.CERTIFICATE}`,
        subType:  action ? action : '',
      },
      {
        id: certId,   // id of the certificate
        type: WsEvents.EnumInteractSubTypes.CERTIFICATE,
      }
    )
  }

  ngOnDestroy(): void {
    this.destroySubject$.unsubscribe()
  }
}
