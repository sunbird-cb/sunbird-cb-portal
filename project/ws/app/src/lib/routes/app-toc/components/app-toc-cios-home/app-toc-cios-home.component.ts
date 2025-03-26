import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { CommonMethodsService } from '@sunbird-cb/consumption'
import { ConfigurationsService, MultilingualTranslationsService, WidgetContentService } from '@sunbird-cb/utils-v2'
import { LoaderService } from '@ws/author/src/public-api'
import { MatSnackBar } from '@angular/material'
import { CertificateService } from '../../../certificate/services/certificate.service'

@Component({
  selector: 'ws-app-app-toc-cios-home',
  templateUrl: './app-toc-cios-home.component.html',
  styleUrls: ['./app-toc-cios-home.component.scss'],
})
export class AppTocCiosHomeComponent implements OnInit, AfterViewInit {
  skeletonLoader = true
  extContentReadData: any = {}
  userExtCourseEnroll: any = {}
  downloadCertificateLoading = false

  rcElem = {
    offSetTop: 0,
    BottomPos: 0,
  }
  @ViewChild('rightContainer', { static: false }) rcElement!: ElementRef
  scrollLimit: any
  scrolled: boolean | undefined
  isMobile = false
  @HostListener('window:scroll', ['$event'])
  handleScroll() {

    if (this.scrollLimit) {
      if ((window.scrollY + this.rcElem.BottomPos) >= this.scrollLimit) {
        this.rcElement.nativeElement.style.position = 'sticky'
      } else {
        this.rcElement.nativeElement.style.position = 'fixed'
      }
    }

    // 236... (OffsetTop of right container + 104)
    if (window.scrollY > (this.rcElem.offSetTop + 104)) {
      this.scrolled = true
    } else {
      this.scrolled = false
    }
  }
  constructor(private route: ActivatedRoute,
              private commonSvc: CommonMethodsService,
              private translate: TranslateService,
              private configSvc: ConfigurationsService,
              private langtranslations: MultilingualTranslationsService,
              private contentSvc: WidgetContentService,
              private certSvc: CertificateService,
              public loader: LoaderService,
              public snackBar: MatSnackBar
  ) {
    this.route.data.subscribe((data: any) => {
      if (data && data.extContent && data.extContent.data && data.extContent.data.content) {
        this.extContentReadData = data.extContent.data.content
        this.extContentReadData['certificateObj'] = {
          data: {},
        }
        this.skeletonLoader = false
      }
      if (data && data.userEnrollContent && data.userEnrollContent.data && data.userEnrollContent.data.result &&
        Object.keys(data.userEnrollContent.data.result).length > 0
      ) {
        this.userExtCourseEnroll = data.userEnrollContent.data.result
        if (this.userExtCourseEnroll.completionpercentage === 100) {
          this.extContentReadData['completionStatus'] = 2
          this.downloadCert()
        }
      }
    })

      if (localStorage.getItem('websiteLanguage')) {
        this.translate.setDefaultLang('en')
        const lang = localStorage.getItem('websiteLanguage')!
        this.translate.use(lang)
      }
  }

  ngOnInit() {
    if (window.innerWidth <= 1200) {
      this.isMobile = true
    } else {
      this.isMobile = false
    }
  }

  handleCapitalize(str: string, type?: string): string {
    return this.commonSvc.handleCapitalize(str, type)
  }

  translateLabels(label: string, type: any) {
    return this.langtranslations.translateLabel(label, type, '')
  }

  ngAfterViewInit() {
    if (this.rcElement) {
      this.rcElem.BottomPos = this.rcElement.nativeElement.offsetTop + this.rcElement.nativeElement.offsetHeight
      this.rcElem.offSetTop = this.rcElement.nativeElement.offsetTop
    }
  }
  redirectToContent(contentData: any) {
    const userData: any = this.configSvc.userProfileV2
    const extUrl: string = contentData.redirectUrl.replace('<username>', userData.email)
    return extUrl
  }
  replaceText(str: any, replaceTxt: any) {
    return str.replaceAll(replaceTxt, '')
  }

  async enRollToExtCourse(contentId: any) {
    this.loader.changeLoad.next(true)
    const reqbody = {
      courseId: contentId,
    }
    const enrollRes = await this.contentSvc.extContentEnroll(reqbody).toPromise().catch(_error => {})
    if (enrollRes && enrollRes.result && Object.keys(enrollRes.result).length > 0) {
      this.getUserContentEnroll(contentId)
    } else {
      this.loader.changeLoad.next(false)
      this.snackBar.open('Unable to enroll to the content')
    }
  }

  async getUserContentEnroll(contentId: any) {
    const enrollRes = await this.contentSvc.fetchExtUserContentEnroll(contentId).toPromise().catch(_error => {})
    if (enrollRes && enrollRes.result  && Object.keys(enrollRes.result).length > 0) {
      this.userExtCourseEnroll = enrollRes.result
      this.loader.changeLoad.next(false)
      this.snackBar.open('Successfully enrolled in the course.')
    } else {
      this.loader.changeLoad.next(false)
      this.snackBar.open('Unable to get the enrolled details')
    }
  }

  async downloadCert() {
    this.downloadCertificateLoading = true
    const certRes: any = await
    this.certSvc.downloadCertificate_v2(this.userExtCourseEnroll.issued_certificates[0].identifier).toPromise().catch(_error => {})
    if (certRes && Object.keys(certRes.result).length > 0) {
      this.downloadCertificateLoading = false
      if (this.userExtCourseEnroll.issued_certificates && this.userExtCourseEnroll.issued_certificates.length
        && this.userExtCourseEnroll.issued_certificates[0]) {
        this.extContentReadData['certificateObj'] = {
          data: this.userExtCourseEnroll.issued_certificates[0],
          certData: certRes.result.printUri,
          certId: this.userExtCourseEnroll.issued_certificates[0].identifier,
        }
      }
    } else {
      this.downloadCertificateLoading = false
    }
  }
}
