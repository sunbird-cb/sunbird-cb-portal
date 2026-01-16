import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import * as _ from 'lodash'
import moment from 'moment'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
 import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { ApiService } from '@ws/author/src/public-api'
import { CertificateService } from '../../services/certificate.service'
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'
// import { IImpressionEventInput,  } from '@project-sunbird/telemetry-sdk'

@Component({
  selector: 'app-certificate-details',
  templateUrl: './certificate-details.component.html',
  styleUrls: ['./certificate-details.component.scss'],
})
export class CertificateDetailsComponent implements OnInit {
  appIcon: SafeUrl | null = null
  loader!: boolean
  viewCertificate!: boolean
  error = false
  enableVerifyButton = false
  certificateCode!: string
  wrongCertificateCode = false
  instance!: string
  // extra
  collectionData!: any
  // telemetryImpressionData: IImpressionEventInput
  // tslint:disable-next-line: prefer-array-literal
  telemetryCdata: Array<{}> = []
  pageId!: string
  // playerConfig: PlayerConfig
  contentId!: string
  showVideoThumbnail = true

  /** To store the certificate details data */
  recipient = 'Amit Kumar'
  courseName = 'Course 1'
  issuedOn = '10 Dec 2020'
  watchVideoLink!: string
  urls = {
    HIERARCHY: 'course/v1/hierarchy',
    LEARNER_PREFIX: '/learner/',
  }
  @ViewChild('codeInputField') codeInputField!: ElementRef

  constructor(
    public activatedRoute: ActivatedRoute,
    public certificateService: CertificateService,
    public configService: ConfigurationsService,
    // public userService: UserService,
    // public playerService: PublicPlayerService,
    private domSanitizer: DomSanitizer,
    public apiService: ApiService,
    public router: Router,
  ) { }

  ngOnInit() {
    this.instance = _.upperCase(this.configService.rootOrg || 'karmyogi')
    // this.pageId = this.activatedRoute.snapshot.data.telemetry.pageid
    if (this.configService.instanceConfig) {
      this.appIcon = this.domSanitizer.bypassSecurityTrustResourceUrl(
        this.configService.instanceConfig.logos.appTransparent,
      )
    }
    // this.setTelemetryData()
  }

  /** It will call the validate cert. api and course_details api (after taking courseId) */
  certificateVerify() {
    this.loader = true
    const request = {
      request: {
        certId: this.activatedRoute.snapshot.params.uuid,
        accessCode: _.trim(this.certificateCode),
        verifySignature: true,
      },
    }
    // setTimeout(() => {
    //   // tslint:disable-next-line: no-console
    //   this.loader = false
    //   this.viewCertificate = true
    // },         1000)
    this.certificateService.validateCertificate(request).subscribe(
      (data: any) => {
        // this.getCourseVideoUrl(_.get(data, 'result.response.related.courseId'))
        const certData = _.get(data, 'result.response.json')
        this.loader = false
        this.viewCertificate = true
        this.recipient = _.get(certData, 'recipient.name')
        this.courseName = _.get(certData, 'badge.name')
        this.issuedOn = moment(new Date(_.get(certData, 'issuedOn'))).format('DD MMM YYYY')
      },
      () => {
        this.wrongCertificateCode = true
        this.loader = false
        this.codeInputField.nativeElement.value = ''
        this.codeInputField.nativeElement.focus()
        this.enableVerifyButton = false
      }
    )
  }
  /** To handle verify button enable/disable fucntionality */
  getCodeLength(event: any) {
    this.wrongCertificateCode = false
    if (event.target.value.length === 6) {
      this.enableVerifyButton = true
    } else {
      this.enableVerifyButton = false
    }
  }
  /** To redirect to courses tab (for mobile device, they will handle 'href' change) */
  navigateToCoursesPage() {
    if (this.activatedRoute.snapshot.queryParams.clientId === 'android') {
      window.location.href = '/page/learn'
    } else {
      this.router.navigate(['/page/learn'])
    }
  }
  /** To set the telemetry*/
  // setTelemetryData() {
  //   const context = { env: this.activatedRoute.snapshot.data.telemetry.env }
  //   if (_.get(this.activatedRoute, 'snapshot.queryParams.clientId') === 'android' &&
  //   _.get(this.activatedRoute, 'snapshot.queryParams.context')) {
  //     const telemetryData = JSON.parse(decodeURIComponent(_.get(this.activatedRoute, 'snapshot.queryParams.context')))
  //     context['env'] = telemetryData.env
  //   }
  //   this.telemetryImpressionData = {
  //     context: context,
  //     edata: {
  //       type: this.activatedRoute.snapshot.data.telemetry.type,
  //       pageid: this.pageId,
  //       uri: this.router.url
  //     }
  //   }
  //   this.telemetryCdata = [
  //     {
  //       id: 'course:qrcode:scan:cert',
  //       type: 'Feature'
  //     },
  //     {
  //       id: 'SB-13854',
  //       type: 'Task'
  //     }
  //   ]
  // }

  /** to get the certtificate video url and courseId from that url */
  getCourseVideoUrl(courseId: string) {
    this.getCollectionHierarchy(courseId).subscribe(
      (response: any) => {
        this.watchVideoLink = _.get(response, 'result.content.certVideoUrl')
        if (this.watchVideoLink) {
          const splitedData = this.watchVideoLink.split('/')
          splitedData.forEach(value => {
            if (value.includes('do_')) {
              this.contentId = value
            }
          })
        }
      },
      (error: any) => {
        if (error) {
          // can do something here
        }
      })
  }
  public getCollectionHierarchy(identifier: string, option: any = { params: {} }): Observable<any> {
    const req = {
      url: `${this.urls.HIERARCHY}/${identifier}`,
      param: option.params,
    }
    return this.apiService.get(req.url, req.param).pipe(map((response: any) => {
      this.collectionData = response.result.content
      return response
    }))
  }
  /** to play content on the certificate details page */
  // playContent(contentId: string) {
  //   this.showVideoThumbnail = false
  //   const option = { params: this.configService.appConfig.ContentPlayer.contentApiQueryParams }
  //   this.playerService.getContent(contentId, option).subscribe(
  //     (response) => {
  //       const contentDetails = {
  //         contentId: contentId,
  //         contentData: response.result.content
  //       }
  //       this.playerConfig = this.playerService.getConfig(contentDetails)
  //     },
  //     (err) => {
  //     })
  // }
}
