import { Component, OnInit, Input, OnDestroy } from '@angular/core'
import { IWidgetsPlayerSurveyData } from './player-survey.model'
import { NsWidgetResolver, WidgetBaseComponent } from '@sunbird-cb/resolver'
import { interval, Subscription } from 'rxjs'
import { ConfigurationsService, EventService, WsEvents } from '@sunbird-cb/utils-v2'
import { ROOT_WIDGET_CONFIG } from '../collection.config'
// import { NsContent } from '../_services/widget-content.model'
import { ActivatedRoute } from '@angular/router'
import { ViewerUtilService } from '@ws/viewer/src/lib/viewer-util.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { ViewerDataService } from '@ws/viewer/src/lib/viewer-data.service'
import { WidgetContentService } from '@sunbird-cb/collection'
import { HttpErrorResponse } from '@angular/common/http'
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'
import * as _ from 'lodash'

const EMAIL_PATTERN = /^[a-zA-Z0-9]+[a-zA-Z0-9._-]*[a-zA-Z0-9]+@[a-zA-Z0-9]+([-a-zA-Z0-9]*[a-zA-Z0-9]+)?(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,4}$/
const MOBILE_PATTERN = /^[0]?[6789]\d{9}$/

@Component({
  selector: 'ws-widget-player-survey',
  templateUrl: './player-survey.component.html',
  styleUrls: ['./player-survey.component.scss'],
})
export class PlayerSurveyComponent extends WidgetBaseComponent
  implements OnInit, NsWidgetResolver.IWidgetData<any>, OnDestroy {
  viewerDataServiceSubscription: Subscription | null = null
  @Input() widgetData!: IWidgetsPlayerSurveyData
  runnerSubs: Subscription | null = null
  enableTelemetry = false
  surveyId: any
  courseId: any
  courseName: any
  apiData: {
    // tslint:disable-next-line:prefer-template
    getAPI: string;
    postAPI: string;
    getAllApplications: string;
    customizedHeader: {};
  } | undefined
  public afterSubmitAction = this.checkAfterSubmit.bind(this)
  isReadOnly = false
  progressStatus: any
  identifierId: any
  resourceId: any
  currentResourceId: any
  userid: any
  contentProgressHash: any = []

  surveyForm!: FormGroup
  formDetails: any
  parentalFields: any[] = []
  childFields: any[] = []
  surveyFormIsValid = true
  addLoader = 0
  wfClientVersion: any = '0'

  constructor(private activatedRoute: ActivatedRoute,
    private eventSvc: EventService,
    private viewerSvc: ViewerUtilService,
    private snackBar: MatSnackBar,
    private viewerDataSvc: ViewerDataService,
    private configSvc: ConfigurationsService,
    private widgetServ: WidgetContentService,
    private fb: FormBuilder,
  ) {
    super()
  }

  ngOnInit() {
    const identifier = this.activatedRoute.snapshot.queryParams.collectionId
    const batchId = this.activatedRoute.snapshot.queryParams.batchId
    this.courseId = this.widgetData.collectionId
    this.courseName = this.widgetData.courseName
    this.progressStatus = this.widgetData.progressStatus
    const sID = this.widgetData.surveyUrl.split('surveys/')
    this.surveyId = sID[1]
    this.identifierId = this.activatedRoute.snapshot.data.content.data.identifier
    this.apiData = {
      // tslint:disable-next-line:prefer-template
      getAPI: '/apis/proxies/v8/forms/getFormById?id=' + this.surveyId,
      postAPI: '/apis/proxies/v8/forms/v1/saveFormSubmit',
      getAllApplications: '/apis/proxies/v8/forms/getAllApplications',
      customizedHeader: {},
    }
    this.widgetData.disableTelemetry = false
    // this.updateProgress(1)

    if (!this.widgetData.disableTelemetry) {
      this.runnerSubs = interval(30000).subscribe(_ => {
        this.eventDispatcher(WsEvents.EnumTelemetrySubType.HeartBeat)
      })
      this.eventDispatcher(WsEvents.EnumTelemetrySubType.Init)
    }

    this.viewerDataServiceSubscription = this.viewerDataSvc.changedSubject.subscribe(_data => {
      if (this.resourceId !== this.viewerDataSvc.resourceId) {
        this.resourceId = this.viewerDataSvc.resourceId
      }
    })

    this.activatedRoute.params.subscribe(params => {
      this.currentResourceId = params['resourceId']
      this.contentProgressHash = []

      if (identifier && batchId && this.configSvc.userProfile) {
        let userId
        if (this.configSvc.userProfile) {
          userId = this.configSvc.userProfile.userId || ''
          this.userid = this.configSvc.userProfile.userId || ''
        }
        const isPreAssessment = this.activatedRoute.snapshot.queryParams.preAssessment
        if (isPreAssessment) {
          this.progressStatus = this.viewerSvc.getPreAssessmentResourceStatus(this.identifierId)
        } else {

          if (this.activatedRoute.snapshot.queryParams.collectionId &&
            this.activatedRoute.snapshot.queryParams.batchId &&
            this.identifierId) {
            const resData = this.viewerSvc.getBatchIdAndCourseId(this.activatedRoute.snapshot.queryParams.collectionId,
              this.activatedRoute.snapshot.queryParams.batchId, this.identifierId)
            const language = this.viewerSvc.getResourceContentLanguage(this.identifierId)
            const req = {
              request: {
                userId,
                language,
                batchId: resData.batchId || '',
                courseId: resData.courseId || '',
                contentIds: [],
                fields: ['progressdetails'],
              },
            }
            this.widgetServ.fetchContentHistoryV2(req).subscribe(
              (data: any) => {
                this.contentProgressHash = data.result.contentList.filter((i: any) => i.contentId === this.currentResourceId)
                if (this.contentProgressHash && this.contentProgressHash.length > 0) {
                  this.progressStatus = this.contentProgressHash[0].status
                }
                this.widgetServ.setProgramChildResumeData(data.result.contentList, resData.courseId)
                // console.log(this.progressStatus)
              })
          }
        }
      }
    })

    this.getFormDetails()
  }

  getFormDetails() {
    this.addLoader = this.addLoader + 1
    this.viewerSvc.getFormById(this.surveyId).subscribe((result: any) => {
      this.addLoader = this.addLoader - 1
      this.wfClientVersion = _.get(result, 'result.response.clientVersion', 0).toString()
      this.formDetails = {
        title: _.get(result, 'result.response.title', ''),
        fields: _.get(result, 'result.response.fields', [])
      }
      if (this.wfClientVersion === '1.1') {
        this.buildForm()
      }
    }, (error: HttpErrorResponse) => {
      if (error) {
        this.addLoader = this.addLoader - 1
      }
    })
  }

  buildForm() {
    if (this.formDetails) {
      this.surveyForm = this.fb.group({
        fields: this.fb.array([])
      })
      const questionsArray = this.questionsArray
      if (this.formDetails.fields) {
        this.formDetails.fields.forEach((field: any) => {
          if (field.fieldType !== 'separator' && field.fieldType !== 'heading') {
            const validatorsArray: any = []
            if (field.isRequired) {
              validatorsArray.push(Validators.required)
            }

            switch (field.fieldType) {
              case 'phone number':
                validatorsArray.push(Validators.pattern(MOBILE_PATTERN))
                validatorsArray.push(Validators.minLength(10))
                validatorsArray.push(Validators.maxLength(10))
                break
              case 'email':
                validatorsArray.push(Validators.pattern(EMAIL_PATTERN))
                break
              case 'numeric':
                break
            }

            const questionGroup = this.fb.group({
              question: [field.name],
              parentId: [field.parentId],
              questionIndex: [questionsArray.length],
              fieldType: [field.fieldType],
              answer: ['', validatorsArray],
              isNA: [false],
              questionId: [field.id]
            })
            field['controlIndex'] = questionsArray.length
            field['validatorsArray'] = validatorsArray
            questionsArray.push(questionGroup)
            if (validatorsArray.length) {
              this.surveyFormIsValid = false
            }
          }

          if (field.parentId) {
            this.childFields.push(field)
          } else {
            this.parentalFields.push(field)
          }
        })
      }
    }
  }

  get questionsArray(): FormArray {
    if (this.surveyForm && this.surveyForm.controls.fields) {
      return this.surveyForm.controls.fields as FormArray
    }
    return this.fb.array([])
  }

  getChildQuestionsFormArray(sectionId: string): FormArray {
    if (this.surveyForm && this.surveyForm.controls.fields) {
      const questionsArray = this.questionsArray
      const childQuestionsArray = questionsArray.controls.filter((question: any) => {
        return question.value && question.value.parentId === sectionId;
      });

      if (childQuestionsArray.length > 0) {
        return this.fb.array(childQuestionsArray);
      }
    }
    return this.fb.array([]) as FormArray
  }

  getChildFields(sectionId: string) {
    let sectionChilds: any = []
    if (this.childFields) {
      sectionChilds = this.childFields.filter((field: any) => field.parentId === sectionId)
    }
    return sectionChilds
  }

  getQuestionControl(index: number) {
    if (this.questionsArray.controls[index]) {
      return this.questionsArray.controls[index]
    }
    return this.fb.group({})
  }

  submitForm() {
    this.surveyForm.markAllAsTouched()
    this.surveyForm.updateValueAndValidity()
    if (this.surveyFormIsValid) {
      const formBody: any = {
        formId: this.surveyId,
        version: 4,
        status: 'SUBMITTED',
        responses: this.dataObject,
        contextId: this.courseId,
        contextName: this.courseName,
      }

      this.addLoader = this.addLoader + 1
      this.viewerSvc.submitForm(formBody).subscribe({
        next: res => {
          this.addLoader = this.addLoader - 1
          if (_.get(res, 'statusInfo.statusCode') === 200 || _.get(res, 'responseCode') === 'OK') {
            this.openSnackbar('Form is submitted successfully')
            this.progressStatus = 2
            this.updateProgress(2)
          } else {
            this.openSnackbar(_.get(res, 'errorMessage', 'Something went wrong please try again'))
          }
        },
        error: (error: HttpErrorResponse) => {
          if (error) {
            this.addLoader = this.addLoader - 1
            this.openSnackbar('Something went wrong please try again')
          }
        }
      })
    }
  }

  get dataObject(): any {
    const dataObject: any = []
    const fields = _.get(this.surveyForm, 'value.fields', [])
    if (fields) {
      fields.forEach((field: any) => {
        let value = field.isNA ? 'N/A' : field.answer
        if (!field.isNA && field.fieldType === 'date' && value) {
          const formattedYear = value.getFullYear()
          const formattedMonth = String(value.getMonth() + 1).padStart(2, '0')
          const formattedDay = String(value.getDate()).padStart(2, '0')
          value = `${formattedYear}-${formattedMonth}-${formattedDay}`
        }
        dataObject.push({
          questionId: field.questionId,
          question: field.question,
          answer: value,
          answerType: field.fieldType
        })
      })
    }
    return dataObject
  }

  updateQuestionValues(event: any) {
    this.questionsArray.value[event.questionIndex] = event
    this.updateSurveyFormValidity()
  }

  updateSurveyFormValidity() { // some times reactive forms not abale to detect value changes and validity in dynamic formArray
    this.surveyFormIsValid = true
    this.questionsArray.controls.forEach((form: any) => {
      if (!form.controls.answer.valid) {
        this.surveyFormIsValid = false
      }
    })
  }

  // async ngAfterViewInit() {
  //   if (this.widgetData && this.widgetData.collectionId) {
  //       await this.fetchContent()
  //   }
  // }

  // async fetchContent() {
  //   const content = await this.contentSvc
  //     .fetchContent(this.widgetData.collectionId || '', 'minimal')
  //     .toPromise()
  //   this.widgetData.courseName = content.result.content.name
  //   this.courseName = this.widgetData.courseName
  //   // tslint:disable-next-line:no-console
  //   console.log('****courseName****', this.courseName)
  // }

  checkAfterSubmit(e: any) {
    // this.renderSubject.next()
    // tslint:disable-next-line:no-console
    console.log(e)
    this.openSnackbar('Survey is submitted successfully')
    this.progressStatus = 2
    this.updateProgress(2)
  }

  updateProgress(status: number) {
    const id = this.activatedRoute.snapshot.data.content ?
      this.activatedRoute.snapshot.data.content.data.identifier : this.widgetData.identifier
    const resData = this.viewerSvc.getBatchIdAndCourseId(this.activatedRoute.snapshot.queryParams.collectionId,
      this.activatedRoute.snapshot.queryParams.batchId, id)
    const collectionId = (resData && resData.courseId) ? resData.courseId : ''
    const batchId = (resData && resData.batchId) ? resData.batchId : ''
    const isPreAssessment = this.activatedRoute.snapshot.queryParams.preAssessment
    if (isPreAssessment) {
      const MIME_TYPE = this.widgetData?.mimeType || "application/survey"
      if (id && collectionId) {
        this.viewerSvc
          .realTimeProgressUpdateForPreAssessmentQuiz(id, status, MIME_TYPE)
      }
    } else
      if (collectionId && batchId && id) {
        this.viewerSvc.realTimeProgressUpdateQuiz(id, collectionId, batchId, status)
      }
  }

  // fireRealTimeProgress(id: string) {
  //   const realTimeProgressRequest = {
  //     ...this.realTimeProgressRequest,
  //     // max_size: this.totalPages,
  //     // current: this.current,
  //   }
  //   const collectionId = this.activatedRoute.snapshot.queryParams.collectionId ?
  //     this.activatedRoute.snapshot.queryParams.collectionId : this.widgetData.identifier
  //   const batchId = this.activatedRoute.snapshot.queryParams.batchId ?
  //     this.activatedRoute.snapshot.queryParams.batchId : this.widgetData.identifier
  //   this.viewerSvc.realTimeProgressUpdate(id, realTimeProgressRequest, collectionId, batchId)
  //   return
  // }

  private eventDispatcher(eventType: WsEvents.EnumTelemetrySubType) {
    if (this.widgetData.disableTelemetry) {
      return
    }
    const commonStructure: WsEvents.WsEventTelemetrySurvey = {
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      from: {
        type: 'widget',
        widgetType: ROOT_WIDGET_CONFIG.player._type,
        widgetSubType: ROOT_WIDGET_CONFIG.player.survey,
      },
      to: '',
      data: {
        eventSubType: eventType,
        object: {
          id: this.widgetData.identifier,
          type: this.widgetData.contentType,
          rollup: {
            l1: this.widgetData.collectionId || '',
          },
        },
      },
    }

    switch (eventType) {
      case WsEvents.EnumTelemetrySubType.HeartBeat:
      case WsEvents.EnumTelemetrySubType.Init:
      case WsEvents.EnumTelemetrySubType.Loaded:
      case WsEvents.EnumTelemetrySubType.StateChange:
      case WsEvents.EnumTelemetrySubType.Unloaded:
        break
      default:
        return
    }
    if (this.enableTelemetry) {
      this.eventSvc.dispatchEvent(commonStructure)
    }
  }

  ngOnDestroy() {
    // if (this.identifier) {
    //   this.fireRealTimeProgress(this.identifier)
    // }
    if (this.viewerDataServiceSubscription) {
      this.viewerDataServiceSubscription.unsubscribe()
    }
  }

  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }
}
