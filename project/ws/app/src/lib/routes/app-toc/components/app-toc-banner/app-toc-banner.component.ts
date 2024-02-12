import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core'
import { MatDialog, MatSnackBar } from '@angular/material'
import { DomSanitizer, SafeStyle } from '@angular/platform-browser'
import { ActivatedRoute, Event, NavigationEnd, Router } from '@angular/router'
import { NsContent, NsGoal, NsPlaylist, viewerRouteGenerator, WidgetContentService } from '@sunbird-cb/collection'
import { TFetchStatus, UtilityService, ConfigurationsService, LoggerService } from '@sunbird-cb/utils'
import { ConfirmDialogComponent } from '@sunbird-cb/collection/src/lib/_common/confirm-dialog/confirm-dialog.component'
import { AccessControlService } from '@ws/author'
import { Subscription } from 'rxjs'
import { NsAnalytics } from '../../models/app-toc-analytics.model'
import { NsAppToc } from '../../models/app-toc.model'
import { AppTocService } from '../../services/app-toc.service'
import { AppTocDialogIntroVideoComponent } from '../app-toc-dialog-intro-video/app-toc-dialog-intro-video.component'
import { MobileAppsService } from 'src/app/services/mobile-apps.service'
import { FormControl, Validators } from '@angular/forms'
import dayjs from 'dayjs'
import * as  lodash from 'lodash'
import { TitleTagService } from '../../services/title-tag.service'
import { ActionService } from '../../services/action.service'
// tslint:disable-next-line
import _ from 'lodash'
import { environment } from 'src/environments/environment'
import { DatePipe } from '@angular/common'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import { EnrollQuestionnaireComponent } from '../enroll-questionnaire/enroll-questionnaire.component'
import { TimerService } from '../../services/timer.service'
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

@Component({
  selector: 'ws-app-toc-banner',
  templateUrl: './app-toc-banner.component.html',
  styleUrls: ['./app-toc-banner.component.scss'],
  providers: [AccessControlService, DatePipe],
})

export class AppTocBannerComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  show = false
  @Input() banners: NsAppToc.ITocBanner | null = null
  @Input() content: NsContent.IContent | null = null
  @Input() resumeData: NsContent.IContinueLearningData | null = null
  @Input() analytics: NsAnalytics.IAnalytics | null = null
  @Input() forPreview = false
  @Input() batchData: /**NsContent.IBatchListResponse */ any | null = null
  @Input() userEnrollmentList: NsContent.ICourse[] | null = null
  @Output() withdrawOrEnroll = new EventEmitter<string>()
  @Input() contentReadData: NsContent.IContent | null = null
  batchControl = new FormControl('', Validators.required)
  primaryCategory = NsContent.EPrimaryCategory
  WFBlendedProgramStatus = NsContent.WFBlendedProgramStatus
  WFSTATUS_MSG_MAPPING = NsContent.WFSTATUS_MSG_MAPPING
  contentProgress = 0
  bannerUrl: SafeStyle | null = null
  routePath = 'overview'
  validPaths = new Set(['overview', 'contents', 'analytics'])
  routerParamSubscription: Subscription | null = null
  routeSubscription: Subscription | null = null
  batchWFDataSubscription: Subscription | null = null
  firstResourceLink: { url: string; queryParams: { [key: string]: any } } | null = null
  resumeDataLink: { url: string; queryParams: { [key: string]: any } } | null = null
  isAssessVisible = false
  isPracticeVisible = false
  editButton = false
  reviewButton = false
  analyticsDataClient: any = null
  btnPlaylistConfig: NsPlaylist.IBtnPlaylist | null = null
  btnGoalsConfig: NsGoal.IBtnGoal | null = null
  isRegistrationSupported = false
  showRejected = false
  checkRegistrationSources: Set<string> = new Set([
    'SkillSoft Digitalization',
    'SkillSoft Leadership',
    'Pluralsight',
  ])
  isUserRegistered = false
  actionBtnStatus = 'wait'
  showIntranetMessage = false
  showTakeAssessment: NsAppToc.IPostAssessment | null = null
  externalContentFetchStatus: TFetchStatus = 'done'
  registerForExternal = false
  isGoalsEnabled = false
  contextId?: string
  contextPath?: string
  tocConfig: any = null
  defaultSLogo = ''
  disableEnrollBtn = false
  selectedBatch!: any
  helpEmail = ''
  selectedBatchSubscription: any
  selectedBatchData: any

  date: any
  now: any
  targetDate: any
  targetTime: any
  difference = 0
  days: any
  hours: any
  minutes: any
  seconds: any
  serverDateSubscription: any
  serverDate: any

  constructor(
    private sanitizer: DomSanitizer,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private tocSvc: AppTocService,
    private contentSvc: WidgetContentService,
    private utilitySvc: UtilityService,
    private mobileAppsSvc: MobileAppsService,
    private snackBar: MatSnackBar,
    public configSvc: ConfigurationsService,
    private tagSvc: TitleTagService,
    private actionSVC: ActionService,
    private logger: LoggerService,
    private datePipe: DatePipe,
    private timerService: TimerService
  ) {
    this.helpEmail = environment.helpEmail
  }

  ngOnInit() {
    this.serverDateSubscription = this.tocSvc.serverDate.subscribe(serverDate => {
      this.serverDate = serverDate
      this.ngAfterViewInit()
    })

    this.route.data.subscribe(data => {
      this.tocConfig = data.pageData.data
      if (this.content && this.isPostAssessment) {
        this.tocSvc.fetchPostAssessmentStatus(this.content.identifier).subscribe(res => {
          const assessmentData = res.result
          for (const o of assessmentData) {
            if (o.contentId === (this.content && this.content.identifier)) {
              this.showTakeAssessment = o
              break
            }
          }
        })
      }

      if (this.content && this.content.identifier) {
        this.tocSvc.fetchGetContentData(this.content.identifier).subscribe(res => {
          this.contentReadData = res.result.content
        })
      }
    })

    const instanceConfig = this.configSvc.instanceConfig
    if (instanceConfig && instanceConfig.logos && instanceConfig.logos.defaultSourceLogo) {
      this.defaultSLogo = instanceConfig.logos.defaultSourceLogo
    }
    if (this.configSvc.restrictedFeatures) {
      this.isGoalsEnabled = !this.configSvc.restrictedFeatures.has('goals')
    }

    this.routeSubscription = this.route.queryParamMap.subscribe(qParamsMap => {
      const contextId = qParamsMap.get('contextId')
      const contextPath = qParamsMap.get('contextPath')
      if (contextId && contextPath) {
        this.contextId = contextId
        this.contextPath = contextPath
      }
    })

    this.batchWFDataSubscription = this.tocSvc.setWFDataSubject.subscribe(
      () => {
        this.setBatchControl()
      },
      () => {
        // tslint:disable-next-line: no-console
        console.log('error on batchWFDataSubscription')
      },
    )

    if (this.configSvc.restrictedFeatures) {
      this.isRegistrationSupported = this.configSvc.restrictedFeatures.has('registrationExternal')
      this.showIntranetMessage = !this.configSvc.restrictedFeatures.has(
        'showIntranetMessageDesktop',
      )
    }

    this.selectedBatchSubscription = this.tocSvc.getSelectedBatch.subscribe(batchData => {
      this.selectedBatchData = batchData
    })

    this.checkRegistrationStatus()
    this.routerParamSubscription = this.router.events.subscribe((routerEvent: Event) => {
      if (routerEvent instanceof NavigationEnd) {
        this.assignPathAndUpdateBanner(routerEvent.url)
      }
    })

    if (this.configSvc.restrictedFeatures) {
      this.isGoalsEnabled = !this.configSvc.restrictedFeatures.has('goals')
    }

    if (this.content) {
      this.btnPlaylistConfig = {
        contentId: this.content.identifier,
        contentName: this.content.name,
        contentType: this.content.contentType,
        primaryCategory: this.content.primaryCategory,
        mode: 'dialog',
      }
      this.btnGoalsConfig = {
        contentId: this.content.identifier,
        contentName: this.content.name,
        contentType: this.content.contentType,
        primaryCategory: this.content.primaryCategory,
      }
    }
  }

  get showIntranetMsg() {
    if (this.isMobile) {
      return true
    }
    return this.showIntranetMessage
  }

  get getBatchDuration() {
    const startDate = dayjs(dayjs(this.batchControl.value.startDate).format('YYYY-MM-DD'))
    const endDate = dayjs(dayjs(this.batchControl.value.endDate).format('YYYY-MM-DD'))
    // adding 1 to include the start date
    return (endDate.diff(startDate, 'days') + 1)
  }

  get showStart() {
    return this.tocSvc.showStartButton(this.content)
  }

  get isPostAssessment(): boolean {
    if (!(this.tocConfig && this.tocConfig.postAssessment)) {
      return false
    }
    if (this.content) {
      return (
        this.content.primaryCategory === NsContent.EPrimaryCategory.COURSE &&
        this.content.learningMode === 'Instructor-Led'
      )
    }
    return false
  }

  get isMobile(): boolean {
    return this.utilitySvc.isMobile
  }

  get showSubtitleOnBanner() {
    return this.tocSvc.subtitleOnBanners
  }

  ngOnChanges() {
    this.assignPathAndUpdateBanner(this.router.url)
    if (this.content) {
      this.fetchExternalContentAccess()
      this.modifySensibleContentRating()
      this.assignPathAndUpdateBanner(this.router.url)
      this.getLearningUrls()
      this.setBatchControl()
    }

    if (this.resumeData && this.resumeData.length > 0 && this.content) {
      let resumeDataV2: any
      if (this.content.completionPercentage === 100) {
        resumeDataV2 = this.getResumeDataFromList('start')
      } else {
        resumeDataV2 = this.getResumeDataFromList()
      }

      if (!resumeDataV2.mimeType) {
        resumeDataV2.mimeType = this.getMimeType(this.content, resumeDataV2.identifier)
      }

      this.resumeDataLink = viewerRouteGenerator(
        resumeDataV2.identifier,
        resumeDataV2.mimeType,
        this.isResource ? undefined : this.content.identifier,
        this.isResource ? undefined : this.content.contentType,
        this.forPreview,
        'Learning Resource',
        this.getBatchId(),
        this.content.name,
      )
      this.actionSVC.setUpdateCompGroupO = this.resumeDataLink
      /* tslint:disable-next-line */
      console.log(this.resumeDataLink,'=====> banner resume data link <========')
    }

    this.batchControl.valueChanges.subscribe((batch: NsContent.IBatch) => {
      this.selectedBatch = batch
      if (batch) {
        if (this.checkRejected(batch)) {
          this.showRejected = true
          return
        }
      }
      this.showRejected = false
      return
    })
  }

  public requestToWithdrawDialog() {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      width: '434px',
      data: {
        title: 'Are you sure you want to withdraw your request?',
        message: 'You will miss the learning opportunity if you withdraw your enrolment.',
        acceptButton: 'Withdraw',
        cancelButton: 'Cancel',
      },
      disableClose: true,
      panelClass: ['animate__animated', 'animate__slideInLeft'],
    })

    confirmDialog.afterClosed().subscribe(result => {
      if (result) {
        // tslint:disable-next-line:max-line-length
        this.requestAndWithDrawEnroll(this.batchData.workFlow.wfItem.currentStatus, this.WFBlendedProgramStatus.WITHDRAW, this.batchData.workFlow.wfItem.wfId)
      }
    })
  }

  public openRequestToEnroll(batchData: any) {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      width: '434px',
      data: {
        title: 'You’re one step away from enrolling!',
        // tslint:disable-next-line:max-line-length
        message: `This batch is active from ${this.datePipe.transform(batchData.startDate, 'dd-MM-yyyy')}  -  ${this.datePipe.transform(batchData.endDate, 'dd-MM-yyyy')}, kindly go through the content and be prepared.`,
        acceptButton: 'Confirm',
        cancelButton: 'Cancel',
      },
      disableClose: true,
      panelClass: ['animate__animated', 'animate__slideInLeft'],
    })
    confirmDialog.afterClosed().subscribe(result => {
      if (result) {
        this.requestAndWithDrawEnroll('INITIATE', 'INITIATE')
      }
    })
  }

  public requestToEnrollDialog() {
    // conflicts check start
    const batchData = this.batchControl.value
    const userList: any = this.userEnrollmentList && this.userEnrollmentList.filter(ele => {
      if (ele.content.primaryCategory === NsContent.EPrimaryCategory.BLENDED_PROGRAM) {
        if (!(dayjs(batchData.startDate).isBefore(dayjs(ele.batch.startDate)) &&
        dayjs(batchData.endDate).isBefore(dayjs(ele.batch.startDate)) ||
        dayjs(batchData.startDate).isAfter(dayjs(ele.batch.endDate)) &&
        dayjs(batchData.endDate).isAfter(dayjs(ele.batch.endDate)))) {
          return true
        }
        return false
      }
      return false
    })

    // conflicts check end
    if (userList && userList.length === 0) {
      if (this.content && this.content.wfSurveyLink) {
        const sID = this.content.wfSurveyLink.split('surveys/')
        const surveyId = sID[1]
        const courseId = this.content.identifier
        const courseName = this.content.name
        const apiData = {
          // tslint:disable-next-line:prefer-template
          getAPI: '/apis/proxies/v8/forms/getFormById?id=' + surveyId,
          // tslint:disable-next-line:prefer-template
          postAPI: '/apis/proxies/v8/forms/v1/saveFormSubmit',
          getAllApplications: '/apis/proxies/v8/forms/getAllApplications',
          customizedHeader: {},
        }
        const enrollQuestionnaire = this.dialog.open(EnrollQuestionnaireComponent, {
          width: '920px',
          maxHeight: '85vh',
          data: {
            surveyId,
            courseId,
            courseName,
            apiData,

          },
          disableClose: false,
          panelClass: ['animate__animated', 'animate__slideInLeft'],
        })
        enrollQuestionnaire.afterClosed().subscribe(result => {
          if (result) {
            this.openRequestToEnroll(batchData)
          }
        })
      } else {
        this.openRequestToEnroll(batchData)
      }
    } else {
      if (userList && userList.length > 0) {
        this.openSnackbar(`You cannot enroll in this blended program because it conflicts with your existing blended program.`)
      }
    }
  }

  public requestAndWithDrawEnroll(state: string, action: string, wfIdValue?: string) {
    let userId = ''
    let rootOrgId = ''
    let username = ''
    let departmentName = ''
    if (this.configSvc.userProfile) {
      userId = this.configSvc.userProfile.userId || ''
      rootOrgId = this.configSvc.userProfile.rootOrgId || ''
      username = this.configSvc.userProfile.firstName || ''
      departmentName = this.configSvc.userProfile.departmentName || ''
    }

    const req = {
      rootOrgId,
      userId,
      state,
      action,
      actorUserId: userId,
      applicationId: this.selectedBatch.batchId,
      serviceName: 'blendedprogram',
      courseId: this.selectedBatch.courseId,
      deptName: departmentName,
      ...(wfIdValue ? { wfId: wfIdValue } : null),
      updateFieldValues: [
        {
          toValue: {
            name: username,
          },
        },
      ],
    }

    this.contentSvc.enrollAndUnenrollUserToBatchWF(req, action).then((data: any) => {
      if (data && data.result && data.result.status === 'OK') {
        this.batchData.workFlow = {
          wfInitiated: true,
          batch: this.selectedBatch,
          wfItem: { currentStatus: data.result.data.status },
        }
        this.withdrawOrEnroll.emit(action)
        this.getBatchUserCount(this.selectedBatch)
        this.openSnackbar(`Request ${ action === this.WFBlendedProgramStatus.WITHDRAW ? 'withdrawn' : 'sent' } Successfully!`)
        this.disableEnrollBtn = false
      } else {
        this.openSnackbar('Something went wrong, please try again later!')
        this.disableEnrollBtn = false
      }
    },                                                               (error: any) => {
      this.openSnackbar(_.get(error, 'error.params.errmsg') ||
        _.get(error, 'error.result.errmsg') ||
        'Something went wrong, please try again later!')
    })
  }

  getMimeType(content: NsContent.IContent, identifier: string): NsContent.EMimeTypes {
    if (content.identifier === identifier) {
      return content.mimeType
    }
    if (content && content.children) {
      if (content.children.length === 0) {
        // big blunder in data
        this.logger.log(content.identifier, 'Wrong mime types for resume')
        return content.mimeType
      }

      const flatList: any[] = []
      const getAllItemsPerChildren: any = (item: NsContent.IContent) => {
        flatList.push(item)
        if (item.children) {
          return item.children.map((i: NsContent.IContent) => getAllItemsPerChildren(i))
        }
        return
      }

      getAllItemsPerChildren(this.content)
      const chld = _.first(_.filter(flatList, { identifier }))
      return chld.mimeType
    }
    // return chld.mimeType
    return NsContent.EMimeTypes.UNKNOWN
  }

  private getBatchId(): string {
    let batchId = ''
    if (this.batchData && this.batchData.content) {
      for (const batch of this.batchData.content) {
        batchId = batch.batchId
      }
    }
    return batchId
  }

  public handleEnrollmentEndDate(batch: any) {
    const enrollmentEndDate = dayjs(lodash.get(batch, 'enrollmentEndDate')).format('YYYY-MM-DD')
    const systemDate = dayjs(this.serverDate).format('YYYY-MM-DD')
    return (enrollmentEndDate && enrollmentEndDate !== 'Invalid Date') ?
      (dayjs(enrollmentEndDate).isSame(systemDate, 'day') || dayjs(enrollmentEndDate).isAfter(systemDate)) : false
  }

  public checkRejected(batch: any) {
    if (
      batch &&
      this.batchData &&
      this.batchData.workFlow &&
      this.batchData.workFlow.wfItem
    ) {
      // tslint:disable-next-line:max-line-length
      if (batch.batchId === this.batchData.workFlow.wfItem.applicationId && (this.batchData.workFlow.wfItem.currentStatus === this.WFBlendedProgramStatus.REJECTED || this.batchData.workFlow.wfItem.currentStatus === this.WFBlendedProgramStatus.REMOVED)) {
        return true
      }
      return false
    }
    return false
  }

  public checkWithdrawn(batch: any) {
    if (
      batch &&
      this.batchData &&
      this.batchData.workFlow &&
      this.batchData.workFlow.wfItem
    ) {
      // tslint:disable-next-line:max-line-length
      if (this.selectedBatch.batchId === this.batchData.workFlow.wfItem.applicationId && (this.batchData.workFlow.wfItem.currentStatus === this.WFBlendedProgramStatus.WITHDRAWN || this.batchData.workFlow.wfItem.currentStatus === this.WFBlendedProgramStatus.WITHDRAWN)) {
        return true
      }
      return false
    }
    return false
  }

  public batchChange(event: any) {
    if (event && event.value) {
      const batchData = {
        content: [event.value],
      }
      this.getBatchUserCount(event.value)
      if (this.selectedBatchData && this.selectedBatchData.content) {
        this.selectedBatchData = {
          ...this.selectedBatchData,
          ...batchData,
        }
      } else {
        this.selectedBatchData = {
          ...batchData,
        }
      }
      if (this.checkRejected(event.value)) {
        this.showRejected = true
        this.setbatchDateToCountDown(event.value.startDate)
        this.tocSvc.getSelectedBatchData(this.selectedBatchData)
        return
      }
      this.setbatchDateToCountDown(event.value.startDate)
      this.tocSvc.getSelectedBatchData(this.selectedBatchData)
    }
    this.showRejected = false
    this.checkBatchStartDate()
    return
  }

  checkBatchStartDate() {
    const batchStartDate = this.selectedBatchData && this.selectedBatchData.content
    && this.selectedBatchData.content[0] && this.selectedBatchData.content[0].startDate
    const workFlow = this.batchData && this.batchData.workFlow && this.batchData.workFlow.wfItem
    && this.batchData.workFlow.wfItem.currentStatus
    const now = dayjs(this.serverDate).format('YYYY-MM-DD')
    const dateExtended = dayjs(now).isSameOrAfter(dayjs(batchStartDate))
    if (dateExtended  && (workFlow && (workFlow !== this.WFBlendedProgramStatus.APPROVED)
    && workFlow !== this.WFBlendedProgramStatus.WITHDRAWN)) {
      const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
        width: '434px',
        data: {
          title: 'Request not approved',
          message: 'Don\'t worry; withdraw this and request another batch.',
          acceptButton: 'Withdraw',
          cancelButton: 'Cancel',
        },
        disableClose: true,
        panelClass: ['animate__animated', 'animate__slideInLeft'],
      })
      confirmDialog.afterClosed().subscribe(result => {
        if (result) {
          // tslint:disable-next-line:max-line-length
          this.requestAndWithDrawEnroll(this.batchData.workFlow.wfItem.currentStatus, this.WFBlendedProgramStatus.WITHDRAW, this.batchData.workFlow.wfItem.wfId)
        }
      })
    }
  }

  public setBatchControl() {
    // on first load select first value in the batch list if its having valid enrollment Date
    if (this.content && this.content.primaryCategory === this.primaryCategory.BLENDED_PROGRAM) {
      if (this.batchData && this.batchData.content.length) {
        if (!this.batchData.workFlow || (this.batchData.workFlow && !this.batchData.workFlow.wfInitiated)) {
          const batch = this.batchData.content.find((el: any) => {
            if (this.handleEnrollmentEndDate(el)) {
              return el
            }
          })

          if (batch) {
            this.batchControl.setValue(batch)
            this.setbatchDateToCountDown(batch.startDate)
          }

          this.getBatchUserCount(this.batchControl.value)
          const batchData = {
            content: [this.batchControl.value],
          }

          if (this.selectedBatchData && this.selectedBatchData.content) {
            this.selectedBatchData = {
              ...this.selectedBatchData,
              ...batchData,
            }
          } else {
            this.selectedBatchData = {
              ...batchData,
            }
          }

          this.tocSvc.getSelectedBatchData(this.selectedBatchData)
        } else {
          const batch = this.batchData.content.find((el: any) => {
            if (el.batchId === this.batchData.workFlow.wfItem.applicationId) {
              return el
            }
          })
          this.selectedBatch = batch
          this.batchControl.patchValue(batch)
          this.batchChange({ value: batch })
        }
      }
    }
  }

  // setting batch start date
  setbatchDateToCountDown(batchStartDate: string) {
    this.targetDate = new Date(batchStartDate)
    const convertedDate = dayjs(batchStartDate).format('YYYY-MM-DD HH:mm:ss')
    this.targetTime = new Date(convertedDate).getTime()
  }

  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }

  get disableWithdrawnBtn() {
    if (
      this.batchData &&
      this.batchData.workFlow &&
      this.batchData.workFlow.wfItem
    ) {
      const status = this.batchData.workFlow.wfItem.currentStatus
      if (NsContent.WFBlendedProgramApprovalTypes.TWO_STEP_MDO_PC === this.batchData.workFlow.wfItem.serviceName &&
        status === this.WFBlendedProgramStatus.SEND_FOR_PC_APPROVAL) {
        return true
      }  if (NsContent.WFBlendedProgramApprovalTypes.TWO_STEP_PC_MDO === this.batchData.workFlow.wfItem.serviceName &&
        status === this.WFBlendedProgramStatus.SEND_FOR_MDO_APPROVAL) {
          return true
      }
    }
    return false
  }

  get showInstructorLedMsg() {
    return (
      this.showActionButtons &&
      this.content &&
      this.content.learningMode === 'Instructor-Led' &&
      !this.content.children.length &&
      !this.content.artifactUrl
    )
  }

  get getWFMsg() {
    if (
      this.batchData &&
      this.batchData.workFlow &&
      this.batchData.workFlow.wfItem
    ) {
      const status = this.batchData.workFlow.wfItem.currentStatus
      const msg = this.WFSTATUS_MSG_MAPPING[status]
      return this.tocConfig[msg]
    }
  }

  get showIcon() {
    if (
      this.batchData &&
      this.batchData.workFlow &&
      this.batchData.workFlow.wfItem
    ) {
      const status = this.batchData.workFlow.wfItem.currentStatus
      if (status === this.WFBlendedProgramStatus.APPROVED ||
        status === this.WFBlendedProgramStatus.SEND_FOR_MDO_APPROVAL ||
        status === this.WFBlendedProgramStatus.SEND_FOR_PC_APPROVAL ||
        status === this.WFBlendedProgramStatus.WITHDRAWN ||
        status === this.WFBlendedProgramStatus.REJECTED ||
        status === this.WFBlendedProgramStatus.REMOVED) {
        return true
      }
    }
    return false
  }

  get showMsg() {
    if (
      this.batchData &&
      this.batchData.workFlow &&
      this.batchData.workFlow.wfItem
    ) {
      const status = this.batchData.workFlow.wfItem.currentStatus
      if (status === this.WFBlendedProgramStatus.APPROVED ||
        status === this.WFBlendedProgramStatus.SEND_FOR_MDO_APPROVAL ||
        status === this.WFBlendedProgramStatus.SEND_FOR_PC_APPROVAL ||
        (status === this.WFBlendedProgramStatus.WITHDRAWN  && this.checkWithdrawn(this.batchData)) ||
        (status === this.WFBlendedProgramStatus.REMOVED  && this.showRejected) ||
        (status === this.WFBlendedProgramStatus.REJECTED  && this.showRejected)) {
        return true
      }
    }
    return false
  }

  get WFIcon() {
    if (
      this.batchData &&
      this.batchData.workFlow &&
      this.batchData.workFlow.wfItem
    ) {
      const status = this.batchData.workFlow.wfItem.currentStatus
      if (status === this.WFBlendedProgramStatus.APPROVED ||
        status === this.WFBlendedProgramStatus.SEND_FOR_MDO_APPROVAL ||
        status === this.WFBlendedProgramStatus.SEND_FOR_PC_APPROVAL ||
        status === this.WFBlendedProgramStatus.WITHDRAWN
      ) {
        return 'circle'
      }
      if (status === this.WFBlendedProgramStatus.REJECTED ||
        status === this.WFBlendedProgramStatus.REMOVED) {
        return 'info'
      }
    }
    return ''
  }

  get iconColor() {
    if (
      this.batchData &&
      this.batchData.workFlow &&
      this.batchData.workFlow.wfItem
    ) {
      const status = this.batchData.workFlow.wfItem.currentStatus
      if (status === this.WFBlendedProgramStatus.APPROVED || status === this.WFBlendedProgramStatus.WITHDRAWN) {
        return 'ws-mat-green-text'
      } if (status === this.WFBlendedProgramStatus.SEND_FOR_MDO_APPROVAL ||
        status === this.WFBlendedProgramStatus.SEND_FOR_PC_APPROVAL) {
        return 'ws-mat-orange-text'
      }
      return ''

    }
    return ' '
  }

  get isHeaderHidden() {
    return this.isResource && this.content && !this.content.artifactUrl.length
  }

  get showActionButtons() {
    return (
      this.actionBtnStatus !== 'wait' &&
      this.content &&
      this.content.status !== 'Deleted' &&
      this.content.status !== 'Expired'
    )
  }

  get showButtonContainer() {
    return (
      this.actionBtnStatus === 'grant' &&
      !(this.isMobile && this.content && this.content.isInIntranet) &&
      !(
        this.content &&
        this.content.contentType === 'Course' &&
        this.content.children.length === 0 &&
        !this.content.artifactUrl
      ) &&
      !(this.content && this.content.contentType === 'Resource' && !this.content.artifactUrl)
    )
  }

  get isResource() {
    if (this.content) {
      const isResource = this.content.contentType === NsContent.EContentTypes.KNOWLEDGE_ARTIFACT ||
        this.content.contentType === NsContent.EContentTypes.RESOURCE || !this.content.children.length
      if (isResource) {
        this.mobileAppsSvc.sendViewerData(this.content)
      }
      return isResource
    }
    return false
  }

   getBatchUserCount(batchData: any) {
    if (batchData && batchData.batchId) {
      const req = {
        serviceName: 'blendedprogram',
        applicationStatus: '',
        applicationIds: [
            batchData.batchId,
        ],
        limit: 100,
        offset: 0,
      }
      const usercount = {
        enrolled: 0,
        totalApplied: 0,
        rejected: 0,
      }
      this.contentSvc.fetchBlendedUserCOUNT(req).then((res: any) => {
        if (res.result && res.result.data) {
          res.result.data.forEach((ele: any) => {
            if (ele.currentStatus === 'APPROVED') {
              usercount.enrolled =  ele.statusCount
            } else if (ele.currentStatus === 'REJECTED') {
              usercount.rejected = ele.statusCount
            }
            if (ele.currentStatus !== 'WITHDRAWN') {
              usercount.totalApplied =  usercount.totalApplied + ele.statusCount
            }
          })
          if (this.selectedBatchData) {
            this.selectedBatchData = {
              ...this.selectedBatchData,
              userCount: usercount,
            }
          }
          this.tocSvc.getSelectedBatchData(this.selectedBatchData)
        }
      })
    }
  }

  private getResumeDataFromList(type?: string) {
    if (!type) {
      // tslint:disable-next-line:max-line-length
      const lastItem = this.resumeData && this.resumeData.sort((a: any, b: any) => new Date(b.lastAccessTime).getTime() - new Date(a.lastAccessTime).getTime()).shift()
      return {
        identifier: lastItem.contentId,
        mimeType: lastItem.progressdetails && lastItem.progressdetails.mimeType,
      }
    }

    const firstItem = this.resumeData && this.resumeData.length && this.resumeData[0]
    return {
      identifier: firstItem.contentId,
      mimeType: firstItem.progressdetails && firstItem.progressdetails.mimeType,
    }
  }

  private modifySensibleContentRating() {
    if (
      this.content &&
      this.content.averageRating &&
      typeof this.content.averageRating !== 'number'
    ) {
      this.content.averageRating = (this.content.averageRating as any)[this.configSvc.rootOrg || '']
    }
    if (this.content && this.content.totalRating && typeof this.content.totalRating !== 'number') {
      this.content.totalRating = (this.content.totalRating as any)[this.configSvc.rootOrg || '']
    }
  }

  private getLearningUrls() {
    if (this.content) {
      if (!this.forPreview) {
        // this.progressSvc.getProgressFor(this.content.identifier).subscribe(data => {
        //   this.contentProgress = data
        // })
      }

      this.isPracticeVisible = Boolean(
        this.tocSvc.filterToc(this.content, NsContent.EFilterCategory.PRACTICE),
      )

      this.isAssessVisible = Boolean(
        this.tocSvc.filterToc(this.content, NsContent.EFilterCategory.ASSESS),
      )

      const firstPlayableContent = this.contentSvc.getFirstChildInHierarchy(this.content)
      this.firstResourceLink = viewerRouteGenerator(
        firstPlayableContent.identifier,
        firstPlayableContent.mimeType,
        this.isResource ? undefined : this.content.identifier,
        this.isResource ? undefined : this.content.contentType,
        this.forPreview,
        this.content.primaryCategory,
        this.getBatchId(),
      )

      /* tslint:disable-next-line */
      console.log(this.firstResourceLink,'=====> banner first data link <========')
    }
  }

  private assignPathAndUpdateBanner(url: string) {
    const path = url.split('/').pop()
    if (path && this.validPaths.has(path)) {
      this.routePath = path
      this.updateBannerUrl()
    }
  }

  private updateBannerUrl() {
    if (this.banners) {
      this.bannerUrl = this.sanitizer.bypassSecurityTrustStyle(
        `url(${this.banners[this.routePath]})`,
      )
    }
  }

  playIntroVideo() {
    if (this.content) {
      this.dialog.open(AppTocDialogIntroVideoComponent, {
        data: this.content.introductoryVideo,
        height: '350px',
        width: '620px',
      })
    }
  }

  get sanitizedIntroductoryVideoIcon() {
    if (this.content && this.content.introductoryVideoIcon) {
      return this.sanitizer.bypassSecurityTrustStyle(`url(${this.content.introductoryVideoIcon})`)
    }
    return null
  }

  private fetchExternalContentAccess() {
    if (this.content && this.content.registrationUrl) {
      if (!this.forPreview) {
        this.externalContentFetchStatus = 'fetching'
        this.registerForExternal = false
        this.tocSvc.fetchExternalContentAccess(this.content.identifier).subscribe(
          data => {
            this.externalContentFetchStatus = 'done'
            this.registerForExternal = data.hasAccess
          },
          _error => {
            this.externalContentFetchStatus = 'done'
            this.registerForExternal = false
          },
        )
      } else {
        this.externalContentFetchStatus = 'done'
        this.registerForExternal = true
      }
    }
  }

  getRatingIcon(ratingIndex: number): 'star' | 'star_border' | 'star_half' {
    if (this.content && this.content.averageRating) {
      const avgRating = this.content.averageRating
      const ratingFloor = Math.floor(avgRating)
      if (ratingIndex <= ratingFloor) {
        return 'star'
      }
      if (ratingFloor === ratingIndex - 1 && avgRating % 1 >= 0.29 && avgRating % 1 < 0.71) {
        return 'star_half'
      }
      if (ratingFloor === ratingIndex - 1 && avgRating % 1 > 0.71) {
        return 'star'
      }
      if (ratingFloor === ratingIndex - 1 && avgRating % 1 < 0.29) {
        return 'star_border'
      }
    }
    return 'star_border'
  }

  private checkRegistrationStatus() {
    const source = (this.content && this.content.sourceShortName) || ''
    if (
      !this.forPreview &&
      !this.isRegistrationSupported &&
      this.checkRegistrationSources.has(source)
    ) {
      this.contentSvc
        .getRegistrationStatus(source)
        .then(res => {
          if (res.hasAccess) {
            this.actionBtnStatus = 'grant'
          } else {
            this.actionBtnStatus = 'reject'
            if (res.registrationUrl && this.content) {
              this.content.registrationUrl = res.registrationUrl
            }
          }
        })
        .catch(_err => { })
    } else {
      this.actionBtnStatus = 'grant'
    }
  }

  generateQuery(type: 'RESUME' | 'START_OVER' | 'START'): { [key: string]: string } {
    if (this.firstResourceLink && (type === 'START' || type === 'START_OVER')) {
      let qParams: { [key: string]: string } = {
        ...this.firstResourceLink.queryParams,
        viewMode: type,
        batchId: this.getBatchId(),
      }
      if (this.contextId && this.contextPath) {
        qParams = {
          ...qParams,
          collectionId: this.contextId,
          collectionType: this.contextPath,
        }
      }
      if (this.forPreview) {
        delete qParams.viewMode
      }
      return qParams
    }

    if (this.resumeDataLink && type === 'RESUME') {
      let qParams: { [key: string]: string } = {
        ...this.resumeDataLink.queryParams,
        batchId: this.getBatchId(),
        viewMode: 'RESUME',
      }
      if (this.contextId && this.contextPath) {
        qParams = {
          ...qParams,
          collectionId: this.contextId,
          collectionType: this.contextPath,
        }
      }
      if (this.forPreview) {
        delete qParams.viewMode
      }
      return qParams
    }
    if (this.forPreview) {
      return {}
    }
    return {
      batchId: this.getBatchId(),
      viewMode: type,
    }
  }

  get isInIFrame(): boolean {
    try {
      return window.self !== window.top
    } catch (e) {
      return true
    }
  }

  public getBgColor(tagTitle: any) {
    const bgColor = this.tagSvc.stringToColor(tagTitle.toLowerCase())
    const color = this.tagSvc.getContrast(bgColor)
    return { color, 'background-color': bgColor }
  }

  ngAfterViewInit() {
    let serverDate = this.serverDate
    if (this.serverDate) {
      setInterval(() => {
        let timer = {
          days: 0,
          hours: 0,
          min: 0,
          seconds: 0,
        }
        serverDate = serverDate  +  1000
        this.date = new Date(serverDate)
        this.now = this.date.getTime()
        this.difference = this.targetTime - this.now
        this.difference = this.difference / (1000 * 60 * 60 * 24)

        this.days = Math.floor(this.difference)
        this.hours = 23 - this.date.getHours()
        this.minutes = 60 - this.date.getMinutes()
        this.seconds = 60 - this.date.getSeconds()
        Number(this.hours)
        !isNaN(this.days)
          ? (this.days = Math.floor(this.difference))
          : (this.days = `<img src="https://i.gifer.com/VAyR.gif" />`)

        timer = {
          days: this.days,
          hours: this.hours,
          min: this.minutes,
          seconds: this.seconds,
        }
        this.timerService.setTimerData(timer)

      },          1000)
    }
  }

  get showDisableMsg() {
    const allBatches = this.batchData.content
    const status: any = []
    if (allBatches) {
      allBatches.forEach((ele: any) => {
        if (!this.handleEnrollmentEndDate(ele) || this.disableEnrollBtn) {
          status.push(ele)
        }
      })
      return status.length === allBatches.length
    }
    return false
  }

  get findMessage() {
    if (this.showDisableMsg) {
      const msg = this.WFSTATUS_MSG_MAPPING.EXPIRED
      return this.tocConfig[msg]
    }
    return ''
  }

  ngOnDestroy() {
    this.tocSvc.analyticsFetchStatus = 'none'
    if (this.routerParamSubscription) {
      this.routerParamSubscription.unsubscribe()
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe()
    }
    if (this.batchWFDataSubscription) {
      this.batchWFDataSubscription.unsubscribe()
    }
    if (this.selectedBatchSubscription) {
      this.selectedBatchSubscription.unsubscribe()
    }
  }
}
