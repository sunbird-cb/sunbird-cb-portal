import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { ConfigurationsService, EventService, LoggerService, WsEvents } from '@sunbird-cb/utils/src/public-api'
import { AccessControlService } from '@ws/author/src/public-api'
import { Subscription } from 'rxjs'
import { ViewerUtilService } from '../../viewer-util.service'
import { NsContent } from '@sunbird-cb/collection/src/lib/_services/widget-content.model'
import { WidgetContentService } from '@sunbird-cb/collection/src/public-api'
import { NSQuiz } from '../../plugins/quiz/quiz.model'

@Component({
    selector: 'viewer-practice',
    templateUrl: './practice-test.component.html',
    styleUrls: ['./practice-test.component.scss'],
})
export class PracticeTestComponent implements OnInit, OnDestroy {
    isPreviewMode = false
    forPreview = window.location.href.includes('/author/')
    testData: NsContent.IContent | null = null
    oldData: NsContent.IContent | null = null
    alreadyRaised = false
    batchId = this.activatedRoute.snapshot.queryParamMap.get('batchId')
    isFetchingDataComplete = false
    quizJson: NSQuiz.IQuiz = {
        timeLimit: 0,
        questions: [],
        isAssessment: false,
    }
    private dataSubscription: Subscription | null = null
    private viewerDataSubscription: Subscription | null = null
    private telemetryIntervalSubscription: Subscription | null = null
    constructor(
        private activatedRoute: ActivatedRoute,
        private accessControlSvc: AccessControlService,
        private viewerSvc: ViewerUtilService,
        private configSvc: ConfigurationsService,
        private eventSvc: EventService,
        private contentSvc: WidgetContentService,
        private log: LoggerService
    ) {

    }
    ngOnInit(): void {
        if (
            this.activatedRoute.snapshot.queryParamMap.get('preview') &&
            !this.accessControlSvc.authoringConfig.newDesign
        ) {
            this.isPreviewMode = true
            this.viewerDataSubscription = this.viewerSvc
                .getContent(this.activatedRoute.snapshot.paramMap.get('resourceId') || '')
                .subscribe(data => {
                    this.testData = data
                    //   console.log(data)
                    this.init()
                })
        } else {
            this.dataSubscription = this.activatedRoute.data.subscribe(
                async data => {
                    this.testData = data.content.data
                    //   console.log(this.testData)
                    this.init()
                })
        }
    }
    init() {
        if (this.testData) {
            this.oldData = this.testData
            this.alreadyRaised = true
            this.raiseEvent(WsEvents.EnumTelemetrySubType.Loaded, this.testData)
        }
        this.isFetchingDataComplete = true
    }
    async fetchContinueLearning(collectionId: string, identifier: string): Promise<boolean> {
        return new Promise(resolve => {
            let userId
            if (this.configSvc.userProfile) {
                userId = this.configSvc.userProfile.userId || ''
            }
            const req: NsContent.IContinueLearningDataReq = {
                request: {
                    userId,
                    batchId: this.batchId,
                    courseId: collectionId || '',
                    contentIds: [],
                    fields: ['progressdetails'],
                },
            }
            this.contentSvc.fetchContentHistoryV2(req).subscribe(
                data => {
                    if (data && data.result && data.result.contentList.length) {
                        for (const content of data.result.contentList) {
                            if (content.contentId === identifier && content.progressdetails) {
                                try {
                                    // const progressdetails = JSON.parse(content.progressdetails)
                                    // this.widgetResolverTestData.widgetData.resumePage = Number(content.progressdetails.current.pop())
                                    // console.log(progressdetails)
                                } catch { }

                            }
                        }
                    }
                    resolve(true)
                },
                () => resolve(true),
            )
        })
    }
    isErrorOccured(event: any) {
        this.log.error(event)
    }
    raiseEvent(state: WsEvents.EnumTelemetrySubType, data: NsContent.IContent) {
        if (this.forPreview) {
            return
        }
        const event = {
            eventType: WsEvents.WsEventType.Telemetry,
            eventLogLevel: WsEvents.WsEventLogLevel.Info,
            from: 'test',
            to: '',
            data: {
                state,
                type: WsEvents.WsTimeSpentType.Player,
                mode: WsEvents.WsTimeSpentMode.Play,
                content: data,
                identifier: data ? data.identifier : null,
                mimeType: NsContent.EMimeTypes.PDF,
                url: data ? data.artifactUrl : null,
            },
        }
        this.eventSvc.dispatchEvent(event)
    }
    ngOnDestroy() {
        if (this.testData) {
            this.raiseEvent(WsEvents.EnumTelemetrySubType.Unloaded, this.testData)
        }
        if (this.dataSubscription) {
            this.dataSubscription.unsubscribe()
        }
        if (this.viewerDataSubscription) {
            this.viewerDataSubscription.unsubscribe()
        }
        if (this.telemetryIntervalSubscription) {
            this.telemetryIntervalSubscription.unsubscribe()
        }
    }
}
