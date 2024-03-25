import { Component, OnInit, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'
import { HttpClient, HttpBackend } from '@angular/common/http'
import { NsContent, WidgetContentService } from '@sunbird-cb/collection'
import { NSQuiz } from '../../plugins/quiz/quiz.model'
import { ActivatedRoute } from '@angular/router'
import { WsEvents, EventService } from '@sunbird-cb/utils'
import { ViewerUtilService } from '../../viewer-util.service'
// import { environment } from 'src/environments/environment'

@Component({
  selector: 'viewer-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
  /* tslint:disable */
  host: { class: 'h-inherit inline-block w-full', style: 'height:  inherit;' },
  /* tslint:enable */
})
export class QuizComponent implements OnInit, OnDestroy {
  private dataSubscription: Subscription | null = null
  isFetchingDataComplete = false
  forPreview = window.location.href.includes('/author/') || window.location.href.includes('?preview=true')
  isErrorOccured = false
  quizData: NsContent.IContent | null = null
  oldData: NsContent.IContent | null = null
  alreadyRaised = false
  quizJson: Partial<NSQuiz.IQuiz> = {
    timeLimit: 0,
    questions: [],
    isAssessment: false,
  }
  constructor(
    private activatedRoute: ActivatedRoute,
    private contentSvc: WidgetContentService,
    private eventSvc: EventService,
    private viewSvc: ViewerUtilService,
    private httpBackend: HttpBackend
  ) { }

  ngOnInit() {
    this.dataSubscription = this.activatedRoute.data.subscribe(
      async data => {
        this.isFetchingDataComplete = false
        this.quizData = data.content.data
        if (this.quizData) {
          const url = this.viewSvc.getPublicUrl(this.quizData.artifactUrl)
          this.quizData.artifactUrl = this.generateUrl(url)
        }
        if (this.alreadyRaised && this.oldData) {
          this.raiseEvent(WsEvents.EnumTelemetrySubType.Unloaded, this.oldData)
        }
        if (this.quizData && this.quizData.artifactUrl.indexOf('content-store') >= 0) {
          await this.setS3Cookie(this.quizData.identifier)
        }
        if (this.quizData) {
          this.quizJson = await this.transformQuiz(this.quizData)
          this.quizJson.timeLimit = this.quizData.duration
        }
        if (this.quizData) {
          this.oldData = this.quizData
          this.alreadyRaised = true
          this.raiseEvent(WsEvents.EnumTelemetrySubType.Loaded, this.quizData)
        }
        setTimeout(() => { this.isFetchingDataComplete = true }, 100)

      },
      () => { },
    )
  }

  async ngOnDestroy() {
    this.isFetchingDataComplete = false
    if (this.activatedRoute.snapshot.queryParams.collectionId &&
      this.activatedRoute.snapshot.queryParams.collectionType
      && this.quizData) {
      await this.contentSvc.continueLearning(
        this.quizData.identifier,
        this.activatedRoute.snapshot.queryParams.collectionId,
        this.activatedRoute.snapshot.queryParams.collectionType,
      )
    } else if (this.quizData) {
      await this.contentSvc.continueLearning(this.quizData.identifier)
    }
    if (this.quizData) {
      this.raiseEvent(WsEvents.EnumTelemetrySubType.Unloaded, this.quizData)
    }
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe()
    }
  }

  raiseEvent(state: WsEvents.EnumTelemetrySubType, data: NsContent.IContent) {
    // if (this.forPreview) {
    //   return
    // }
    const event = {
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      from: 'quiz',
      to: '',
      data: {
        state,
        type: WsEvents.WsTimeSpentType.Player,
        mode: WsEvents.WsTimeSpentMode.Play,
        content: data,
        identifier: data ? data.identifier : null,
        mimeType: NsContent.EMimeTypes.QUIZ,
        url: data ? data.artifactUrl : null,
        object: { id: data ? data.identifier : null, type: data ? data.primaryCategory : '' },
      },
    }
    this.eventSvc.dispatchEvent(event)
  }

  generateUrl(oldUrl: string) {
    return oldUrl
    // const chunk = oldUrl.split('/')
    // const newChunk = environment.azureHost.split('/')
    // const newLink = []
    // for (let i = 0; i < chunk.length; i += 1) {
    //   if (i === 2) {
    //     newLink.push(newChunk[i])
    //   } else if (i === 3) {
    //     newLink.push(environment.azureBucket)
    //   } else {
    //     newLink.push(chunk[i])
    //   }
    // }
    // const newUrl = newLink.join('/')
    // return newUrl
  }

  private async transformQuiz(content: NsContent.IContent): Promise<NSQuiz.IQuiz> {
    // const artifactUrl = this.forPreview
    //   ? this.viewSvc.getAuthoringUrl(content.artifactUrl)
    //   : content.artifactUrl
    const url = this.viewSvc.getPublicUrl(content.artifactUrl)
    const artifactUrl = this.generateUrl(url)
    const newHttpClient = new HttpClient(this.httpBackend)
    let quizJSON: NSQuiz.IQuiz = await newHttpClient
      .get<any>(artifactUrl || '')
      .toPromise()
      .catch((_err: any) => {
        // throw new DataResponseError('MANIFEST_FETCH_FAILED');
      })
    if (this.forPreview && quizJSON) {
      quizJSON = this.viewSvc.replaceToAuthUrl(quizJSON)
    }
    quizJSON.questions.forEach((question: NSQuiz.IQuestion) => {
      if (question.multiSelection && question.questionType === undefined) {
        question.questionType = 'mcq-mca'
      } else if (!question.multiSelection && question.questionType === undefined) {
        question.questionType = 'mcq-sca'
      }
    })
    return quizJSON
  }
  private async setS3Cookie(contentId: string) {
    await this.contentSvc
      .setS3Cookie(contentId)
      .toPromise()
      .catch(() => {
        // throw new DataResponseError('COOKIE_SET_FAILURE')
      })
    return
  }
}
