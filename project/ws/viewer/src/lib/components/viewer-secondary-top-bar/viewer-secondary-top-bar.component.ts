import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'
import { ActivatedRoute, NavigationEnd, NavigationExtras, Router } from '@angular/router'
import { WidgetContentService } from '@sunbird-cb/collection/src/lib/_services/widget-content.service'
import { NsContent, VIEWER_ROUTE_FROM_MIME } from '@sunbird-cb/collection'
import { ConfigurationsService, EventService, NsPage, ValueService, WsEvents } from '@sunbird-cb/utils-v2'
import { Subscription } from 'rxjs'
import { ViewerDataService } from '../../viewer-data.service'
import { ViewerUtilService } from '../../viewer-util.service'
import { CourseCompletionDialogComponent } from '../course-completion-dialog/course-completion-dialog.component'
import { PdfScormDataService } from '../../pdf-scorm-data-service'
import { AppTocService } from '@ws/app/src/lib/routes/app-toc/services/app-toc.service'
import { WidgetContentLibService } from '@sunbird-cb/consumption'
// import { WidgetContentService as WidgetContentServiceUtils } from '@sunbird-cb/utils-v2'

@Component({
  selector: 'viewer-viewer-secondary-top-bar',
  templateUrl: './viewer-secondary-top-bar.component.html',
  styleUrls: ['./viewer-secondary-top-bar.component.scss'],
})
export class ViewerSecondaryTopBarComponent implements OnInit, OnDestroy {

  @Input() frameReference: any
  @Input() forPreview = false
  @Input() content: any
  @Output() toggle = new EventEmitter()
  @Input() leafNodesCount: any
  @Input() contentMIMEType: any
  @Input() completedCount: any
  @Input() baseContentReadData: any
  private viewerDataServiceSubscription: Subscription | null = null
  private paramSubscription: Subscription | null = null
  private viewerDataServiceResourceSubscription: Subscription | null = null
  appIcon: SafeUrl | null = null
  isTypeOfCollection = false
  courseName = ''
  collectionType: string | null = null
  prevResourceUrl: string | null = null
  nextResourceUrl: string | null = null
  prevResourceUrlParams!: NavigationExtras
  nextResourceUrlParams!: NavigationExtras
  pageNavbar: Partial<NsPage.INavBackground> = this.configSvc.pageNavBar
  resourceId: string = (this.viewerDataSvc.resourceId as string) || ''
  resourceName: string | null = this.viewerDataSvc.resource ? this.viewerDataSvc.resource.name : ''
  resourcePrimaryCategory: string | null = this.viewerDataSvc.resource ? this.viewerDataSvc.resource.primaryCategory : ''
  contentProgressHash: any = []
  // previousResourcePrimaryCategory!: NsContent.EPrimaryCategory
  // nextResourcePrimaryCategory!: NsContent.EPrimaryCategory
  collectionId = ''
  logo = true
  isPreview = false
  forChannel = false
  currentRoute = window.location.pathname
  identifier: any
  batchId: any
  userid: any
  channelId: any
  optionalLink = false
  isMobile = false
  handleBackFromPdfScormFullScreenFlag = false
  toggleSideBarFlag = true
  enableShare = false
  pdfContentProgressData: any = { status: 1 }
  canShare = false
  rootOrgId: any
  currentDataFromEnrollList: any
  enrollmentList: any = []
  pageScrollSubscription: Subscription | null = null
  // primaryCategory = NsContent.EPrimaryCategory
  contentPrimaryCategory: any
  constructor(
    private activatedRoute: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    // private logger: LoggerService,
    private configSvc: ConfigurationsService,
    private viewerDataSvc: ViewerDataService,
    private valueSvc: ValueService,
    private dialog: MatDialog,
    private router: Router,
    private widgetServ: WidgetContentService,
    private viewerSvc: ViewerUtilService,
    private pdfScormDataService: PdfScormDataService,
    private events: EventService,
    private appTocSvc: AppTocService,
    private widgetLibSvc: WidgetContentLibService,
    // private contentSvc: WidgetContentServiceUtils
    
  ) {
    this.valueSvc.isXSmall$.subscribe(isXSmall => {
      this.logo = !isXSmall
    })
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url
      }
    })
  }

  ngOnInit() {
    // this.getAuthDataIdentifer()
    this.enrollmentList = this.activatedRoute.snapshot.data.enrollmentData
    && this.activatedRoute.snapshot.data.enrollmentData.data || []
    
    this.contentPrimaryCategory = this.activatedRoute?.snapshot?.data?.contentRead && 
      this.activatedRoute?.snapshot?.data?.contentRead?.data?.result?.content?.primaryCategory

    this.pageScrollSubscription = this.appTocSvc.updatePageScroll.subscribe((value: boolean) => {
      if (value) {
        setTimeout(() => {
          if (document.getElementsByClassName('viewer-top-secondary')  &&
          document.getElementsByClassName('viewer-top-secondary')[0]) {
            document.getElementsByClassName('viewer-top-secondary')[0].scrollIntoView({
              behavior: 'smooth',
              block: 'start',
              inline: 'start',
           })
          }
        },         1000)
      }
    })

    if (window.innerWidth <= 1200) {
      this.isMobile = true
    } else {
      this.isMobile = false
    }
    this.pdfScormDataService.handleBackFromPdfScormFullScreen.subscribe((data: any) => {
      this.handleBackFromPdfScormFullScreenFlag = data
    })
    this.pdfScormDataService.handlePdfMarkComplete.subscribe((contentData: any) => {
      this.pdfContentProgressData = contentData
    })
    this.viewerSvc.autoPlayNextVideo.subscribe((autoPlayVideoData: any) => {
      if (autoPlayVideoData) {
        if (this.isTypeOfCollection && this.nextResourceUrl && this.nextResourceUrlParams && this.nextResourceUrlParams.queryParams) {
          this.router.navigate([this.nextResourceUrl], { queryParams: this.nextResourceUrlParams.queryParams })
        }
      }
    })
    this.viewerSvc.autoPlayNextAudio.subscribe((autoPlayVideoData: any) => {
      if (autoPlayVideoData) {
        if (this.isTypeOfCollection && this.nextResourceUrl && this.nextResourceUrlParams && this.nextResourceUrlParams.queryParams) {
          this.router.navigate([this.nextResourceUrl], { queryParams: this.nextResourceUrlParams.queryParams })
        }
      }
    })

    if (window.location.href.includes('/channel/')) {
      this.forChannel = true
    }
    this.isTypeOfCollection = this.activatedRoute.snapshot.queryParams.collectionType ? true : false
    this.collectionType = this.activatedRoute.snapshot.queryParams.collectionType
    this.courseName = this.activatedRoute.snapshot.queryParams.courseName
    this.channelId = this.activatedRoute.snapshot.queryParams.channelId
    if (this.configSvc.instanceConfig) {
      this.appIcon = this.domSanitizer.bypassSecurityTrustResourceUrl(
        this.configSvc.instanceConfig.logos.app,
      )
    }
    //   this.route.data.subscribe((data: any) => {
    //     this.appIcon =
    //     this.domSanitizer.bypassSecurityTrustResourceUrl(data.configData.data.logos.app)
    //   }
    // )
    this.viewerDataSvc.isSkipBtn.subscribe((data: any) => {
      if (data !== undefined) {
        this.optionalLink = data
      } else {
        this.optionalLink = false
      }
    })

    this.viewerDataServiceSubscription = this.viewerDataSvc.tocChangeSubject.subscribe((data:any) => {
      if (data.prevResource) {
        if(data.prevResource && !data.prevResource.viewerUrl) {
          data.prevResource['viewerUrl'] = `${this.forPreview ? '' : ''}/viewer/${VIEWER_ROUTE_FROM_MIME(
            data.prevResource.mimeType,
            // )}/${content.identifier}?primaryCategory=${content.primaryCategory}
            // &collectionId=${this.viewerDataSvc.collectionId}&collectionType=${this.collectionType}
            // &batchId=${this.batchId}&viewMode=${this.viewMode}`,
          )}/${data.prevResource.identifier}`
          this.prevResourceUrl = data.prevResource.viewerUrl
        } else {
          this.prevResourceUrl = data.prevResource.viewerUrl
        }
        
        this.prevResourceUrlParams = {
          queryParams: {
            primaryCategory: data.prevResource.primaryCategory,
            collectionId: data.prevResource.collectionId,
            collectionType: data.prevResource.collectionType || this.collectionType,
            batchId: data.prevResource.batchId,
            viewMode: data.prevResource.viewMode,
            preview: this.forPreview,
            channelId: this.channelId,
            ...(data.queryMLParams ? data.queryMLParams : null),
            ...(window.location.href.includes('editMode=true') ? { editMode: true } : {}),
            ...(window.location.href.includes('preAssessment=true') ? { preAssessment: true } : {}),
          },
          fragment: '',
        }
        if (data.prevResource.optionalReading && data.prevResource.primaryCategory === 'Learning Resource') {
          this.updateProgress(2, data.prevResource.identifier)
        }
        // if(data.prevResource?.isMandatory) {
        //   this.updateProgressForPreAssessment(data)
        // }
      } else {
        this.prevResourceUrl = null
      }
      if (data.nextResource) {
        if(data.nextResource && !data.nextResource.viewerUrl) {
          data.nextResource['viewerUrl'] = `${this.forPreview ? '' : ''}/viewer/${VIEWER_ROUTE_FROM_MIME(
            data.nextResource.mimeType,
            // )}/${content.identifier}?primaryCategory=${content.primaryCategory}
            // &collectionId=${this.viewerDataSvc.collectionId}&collectionType=${this.collectionType}
            // &batchId=${this.batchId}&viewMode=${this.viewMode}`,
          )}/${data.nextResource.identifier}`
          this.nextResourceUrl = data.nextResource.viewerUrl
        } else {
          this.nextResourceUrl = data.nextResource.viewerUrl
        }
        
        this.nextResourceUrlParams = {
          queryParams: {
            primaryCategory: data.nextResource.primaryCategory,
            collectionId: data.nextResource.collectionId,
            collectionType: data.nextResource.collectionType || this.collectionType,
            batchId: data.nextResource.batchId,
            viewMode: data.nextResource.viewMode,
            courseName: this.courseName,
            preview: this.forPreview,
            channelId: this.channelId,
            ...(data.queryMLParams ? data.queryMLParams : null),
            ...(window.location.href.includes('editMode=true') ? { editMode: true } : {}),
            ...(window.location.href.includes('preAssessment=true') ? { preAssessment: true } : {}),
          },
          fragment: '',
        }
        if (data.nextResource.optionalReading && data.nextResource.primaryCategory === 'Learning Resource') {
          this.updateProgress(2, data.nextResource.identifier)
        }
        // if(data.prevResource?.isMandatory) {
        //   this.updateProgressForPreAssessment(data)
        // }
      } else {
        this.nextResourceUrl = null
      }
      if (this.resourceId !== this.viewerDataSvc.resourceId) {
        this.resourceId = this.viewerDataSvc.resourceId as string
        this.resourceName = this.viewerDataSvc.resource ? this.viewerDataSvc.resource.name : ''
        this.resourcePrimaryCategory = this.viewerDataSvc.resource ? this.viewerDataSvc.resource.primaryCategory : ''
      }
    })
    this.paramSubscription = this.activatedRoute.queryParamMap.subscribe(async params => {
      this.collectionId = params.get('collectionId') as string
      this.isPreview = params.get('preview') === 'true' ? true : false
      const enrollList: any = this.widgetLibSvc.getEnrolledDataFromList(this.enrollmentList.courses, this.collectionId) || '{}'
      this.currentDataFromEnrollList =  enrollList
    })

    this.viewerDataServiceResourceSubscription = this.viewerDataSvc.changedSubject.subscribe(
      _data => {
        this.resourceId = this.viewerDataSvc.resourceId as string
        this.resourceName = this.viewerDataSvc.resource ? this.viewerDataSvc.resource.name : ''
        this.resourcePrimaryCategory = this.viewerDataSvc.resource ? this.viewerDataSvc.resource.primaryCategory : ''
      },
    )

    if (this.currentDataFromEnrollList && this.currentDataFromEnrollList.content && ![
      NsContent.ECourseCategory.MODERATED_COURSE,
      NsContent.ECourseCategory.MODERATED_ASSESSEMENT,
      NsContent.ECourseCategory.MODERATED_PROGRAM,
      NsContent.ECourseCategory.INVITE_ONLY_PROGRAM,
    ].includes(this.currentDataFromEnrollList.content.courseCategory)) {
      this.canShare = true
      if (this.configSvc.userProfile) {
        this.rootOrgId = this.configSvc.userProfile.rootOrgId
      }
    }
  }

  updateProgress(status: number, resourceId: any) {
    const collectionId = this.activatedRoute.snapshot.queryParams.collectionId ?
      this.activatedRoute.snapshot.queryParams.collectionId : ''
    // const collectionId = this.activatedRoute.snapshot.params.id ?
    // this.activatedRoute.snapshot.params.id : ''
    const batchId = this.activatedRoute.snapshot.queryParams.batchId ?
      this.activatedRoute.snapshot.queryParams.batchId : ''
    const isPreAssessment = this.activatedRoute.snapshot.queryParams.preAssessment
    if(isPreAssessment) {
        return this.viewerSvc
          .realTimeProgressUpdateForPreAssessmentQuiz(resourceId,  status)
      
    }
    return this.viewerSvc.realTimeProgressUpdateQuiz(resourceId, collectionId, batchId, status)
  }

  ngOnDestroy() {
    if (this.viewerDataServiceSubscription) {
      this.viewerDataServiceSubscription.unsubscribe()
    }
    if (this.paramSubscription) {
      this.paramSubscription.unsubscribe()
    }
    if (this.viewerDataServiceResourceSubscription) {
      this.viewerDataServiceResourceSubscription.unsubscribe()
    }
    if (this.pageScrollSubscription) {
      this.pageScrollSubscription.unsubscribe()
    }
  }

  toggleSideBar() {
    this.toggleSideBarFlag = !this.toggleSideBarFlag
    this.toggle.emit()
  }
  get needToHide(): boolean {
    return this.router.url.includes('all/assessment/')
  }

  back() {
    try {
      if (window.self !== window.top) {
        return
      }
      window.history.back()
    } catch (_ex) {
      window.history.back()
    }
  }

  finishDialog() {
    if(window.location.href.includes('preAssessment=true')) {
      this.router.navigateByUrl(`app/toc/${this.collectionId}/overview`)
    }
    else if (!this.forPreview) {
      this.contentProgressHash = []
      this.identifier = this.activatedRoute.snapshot.queryParams.collectionId
      this.batchId = this.activatedRoute.snapshot.queryParams.batchId

      if (this.identifier && this.batchId && this.configSvc.userProfile) {
        let userId
        if (this.configSvc.userProfile) {
          userId = this.configSvc.userProfile.userId || ''
          this.userid = this.configSvc.userProfile.userId || ''
        }

        const language = this.viewerSvc.getResourceContentLanguage(this.identifier)  
        const req = {
          request: {
            userId,
            language,
            batchId: this.batchId,
            courseId: this.identifier || '',
            contentIds: [],
            fields: ['progressdetails'],
          },
        }
        this.widgetServ.fetchContentHistoryV2(req).subscribe(
          (data: any) => {
            this.contentProgressHash = data.result.contentList
            this.widgetServ.setProgramChildResumeData(this.contentProgressHash, this.identifier)

            const lastIndexData = this.contentProgressHash?.length && this.contentProgressHash[this.contentProgressHash?.length - 1]
            if(lastIndexData && lastIndexData?.completionPercentage === 100 && lastIndexData?.status === 2) {
              this.generateCertificate()
            }
            if (this.content && ![
              NsContent.ECourseCategory.MODERATED_COURSE,
              NsContent.ECourseCategory.MODERATED_ASSESSEMENT,
              NsContent.ECourseCategory.MODERATED_PROGRAM,
              NsContent.ECourseCategory.INVITE_ONLY_PROGRAM,
            ].includes(this.content.courseCategory)) {
              if (this.completedCount === this.leafNodesCount) {

                this.showCompletionPopUp()
              } else {
                this.router.navigateByUrl(`app/toc/${this.collectionId}/overview`)
              }
            } else {
              if (this.leafNodesCount === this.contentProgressHash.length) {
                const ipStatusCount = this.contentProgressHash.filter((item: any) => item.status === 1)
                if (ipStatusCount.length === 0) {
                  this.showCompletionPopUp()
                } else {
                  this.router.navigateByUrl(`app/toc/${this.collectionId}/overview`)
                }
              } else {
                this.router.navigateByUrl(`app/toc/${this.collectionId}/overview`)
              }
            }
          })
      }
    } else {
      if (window.location.href.includes('editMode=true')) {
        this.router.navigateByUrl(`public/toc/${this.collectionId}/overview?editMode=true`)
      } else {
        this.router.navigateByUrl(`public/toc/${this.collectionId}/overview`)
      }

    }
  }

  showCompletionPopUp() {
    let id = ''
    const MLID = this.activatedRoute.snapshot.queryParams.MLId ?
                  this.activatedRoute.snapshot.queryParams.MLId : ''
    // check if multilingual ID is there then hit the API with MLID
    id = MLID ? MLID : this.identifier
    const dialogRef = this.dialog.open(CourseCompletionDialogComponent, {
      autoFocus: false,
      panelClass: 'course-completion-dialog',
      data: {
        courseName: this.activatedRoute.snapshot.queryParams.courseName,
        userId: this.userid,
        identifier: id,
        primaryCategory: this.collectionType,
        courseCategory: this.currentDataFromEnrollList.content.courseCategory,
        collectionId: this.identifier // In case of multilingual course, redirection should happen to base collectionID
      },
    })
    dialogRef.afterClosed().subscribe(result => {
      const app: any = document.getElementById('viewer-conatiner-backdrop')
      app.style.filter = 'blur(0px)'
      if (result === true) {
        this.router.navigateByUrl(`app/toc/${this.identifier}/overview`)
      }
    })
  }

  markAsComplete() {
    this.viewerSvc.markAsCompleteSubject.next(true)
    if (!this.nextResourceUrl) {
      this.pdfContentProgressData['status'] = 2
      this.finishDialog()
    }
    this.changeResource()
  }

  changeResource() {
    setTimeout(() => {
      this.appTocSvc.getPageScroll.next(true)
    },         700)
  }

  checkForNextOfflineOnlineSession() {
    const nextUrl: any = this.nextResourceUrl
    if ((nextUrl.includes('offline-session')) ||
    (nextUrl.includes('online-session'))
    ) {
      this.router.navigate([this.nextResourceUrl], { queryParams: this.nextResourceUrlParams.queryParams })
      // setTimeout(() => {
      //   this.router.navigate([this.nextResourceUrl], { queryParams: this.nextResourceUrlParams.queryParams })
      // },         0)
    }
    this.changeResource()
  }

  checkForPrevOfflineOnlineSession() {
    const prevUrl: any = this.prevResourceUrl
    if ((prevUrl.includes('offline-session')) ||
    (prevUrl.includes('online-session'))

    ) {
      this.router.navigate([this.prevResourceUrl], { queryParams: this.prevResourceUrlParams.queryParams })
      // setTimeout(() => {
      //   this.router.navigate([this.prevResourceUrl], { queryParams: this.prevResourceUrlParams.queryParams })
      // },         0)
    }
    this.changeResource()
  }

  onClickOfShare() {
    this.enableShare = true
    this.raiseTelemetryForShare('shareContent')
  }

  /* tslint:disable */
  raiseTelemetryForShare(subType: any) {
    this.events.raiseInteractTelemetry(
      {
        type: 'click',
        subType,
        id: this.content ? this.content.identifier : '',
      },
      {
        id: this.content ? this.content.identifier : '',
        type: this.content ? this.content.primaryCategory : '',
      },
      {
        pageIdExt: `btn-${subType}`,
        module: WsEvents.EnumTelemetrymodules.CONTENT,
      }
    )
  }

  resetEnableShare() {
    this.enableShare = false
  }

  backToPrev() {
    if(this.prevResourceUrl) {
      this.router.navigate([this.prevResourceUrl], { queryParams: this.prevResourceUrlParams.queryParams })
    } else {
      if(!this.forPreview) {
        this.router.navigateByUrl(`app/toc/${this.collectionId}/overview`)
      } else {
        this.router.navigateByUrl(`public/toc/${this.collectionId}/overview`)
      }

    }
  }

  // updateProgressForPreAssessment(data:any) {
  //   console.log('data--', data)
  //   console.log('this.tocSvc.hashmap', this.appTocSvc.hashmap)
  // }

    generateCertificate() {
      // const allowedPrimaryCategory = ALLOWED_CATEGORY_FOR_DYNAMIC_GENERATION?.map(
      //   (cat: string) => cat?.toLowerCase()
      // );

      // if (
      //   allowedPrimaryCategory &&
      //   (allowedPrimaryCategory.includes(this.contentPrimaryCategory?.toLowerCase()) ||
      //   allowedPrimaryCategory.includes(this.currentDataFromEnrollList.content.courseCategory?.toLowerCase()) )
      // ) {
      //   const payload = {
      //     request: {
      //       courseId: this.identifier,
      //       batchId: this.batchId,
      //       userId: this.userid,
      //     },
      //   };
      //   this.contentSvc.downloadCertV2(payload).subscribe(() => {});
      // } 
  }
}
