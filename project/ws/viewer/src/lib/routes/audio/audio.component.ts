import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { Subscription } from 'rxjs'
import { ValueService } from '@sunbird-cb/utils-v2'
import { ActivatedRoute } from '@angular/router'
import { AccessControlService } from '@ws/author'
import {
  NsContent,
  IWidgetsPlayerMediaData,
  NsDiscussionForum,
  WidgetContentService,
} from '@sunbird-cb/collection'
import { ViewerUtilService } from '../../viewer-util.service'
import { NsWidgetResolver } from '@sunbird-cb/resolver'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'viewer-audio',
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.scss'],
})
export class AudioComponent implements OnInit, OnDestroy {
  @Input() hideUpNext = false
  private routeDataSubscription: Subscription | null = null
  private screenSizeSubscription: Subscription | null = null
  private viewerDataSubscription: Subscription | null = null
  isScreenSizeSmall = false
  isNotEmbed = true
  isFetchingDataComplete = false
  forPreview = window.location.href.includes('/public/') || window.location.href.includes('&preview=true')
  audioData: NsContent.IContent | null = null
  widgetResolverAudioData: NsWidgetResolver.IRenderConfigWithTypedData<
    IWidgetsPlayerMediaData
  > | null = null
  discussionForumWidget: NsWidgetResolver.IRenderConfigWithTypedData<
    NsDiscussionForum.IDiscussionForumInput
  > | null = null
  channelId: any
  constructor(
    private activatedRoute: ActivatedRoute,
    private contentSvc: WidgetContentService,
    private valueSvc: ValueService,
    private viewerSvc: ViewerUtilService,
    private accessControlSvc: AccessControlService,
  ) { }

  ngOnInit() {
    this.screenSizeSubscription = this.valueSvc.isXSmall$.subscribe(data => {
      this.isScreenSizeSmall = data
    })
    this.channelId = this.activatedRoute.snapshot.queryParamMap.get('channelId')
    this.isNotEmbed = !(
      window.location.href.includes('/embed/') ||
      this.activatedRoute.snapshot.queryParams.embed === 'true'
    )
    if (
      this.activatedRoute.snapshot.queryParamMap.get('preview') &&
      !this.accessControlSvc.authoringConfig.newDesign
    ) {
      // to do make sure the data updates for two consecutive resource of same mimeType
      this.viewerDataSubscription = this.activatedRoute.data.subscribe(data => {
        this.audioData = data.content.data
        if (this.audioData) {
          this.formDiscussionForumWidget(this.audioData)
        }
        this.widgetResolverAudioData = this.initWidgetResolverAudioData()
        if (this.activatedRoute.snapshot.queryParams.collectionId) {
          this.widgetResolverAudioData.widgetData.collectionId = this.activatedRoute.snapshot.queryParams.collectionId
        } else {
          this.widgetResolverAudioData.widgetData.collectionId = ''
        }
        // this.widgetResolverAudioData.widgetData.url = this.audioData
        //   ? `/apis/authContent/${encodeURIComponent(this.audioData.artifactUrl)}`
        //   : ''
        // if (this.audioData) {
        //   this.widgetResolverAudioData.widgetData.url = this.audioData.artifactUrl
        // }
        // tslint:disable-next-line
        const url = this.generateUrl(this.audioData!.artifactUrl)
        this.widgetResolverAudioData.widgetData.url = this.viewerSvc.getPublicUrl(url)
        if (this.audioData) {
          this.widgetResolverAudioData.widgetData.mimeType = this.audioData.mimeType
          this.widgetResolverAudioData.widgetData.contentType = this.audioData.contentType
          this.widgetResolverAudioData.widgetData.primaryCategory = this.audioData.primaryCategory
          this.widgetResolverAudioData.widgetData.identifier = this.audioData.identifier
          this.widgetResolverAudioData.widgetData.version = `${this.audioData.version}${''}`
          this.widgetResolverAudioData.widgetData.channel = this.channelId
        }
        this.widgetResolverAudioData.widgetData.disableTelemetry = false
        this.isFetchingDataComplete = true
        if (this.widgetResolverAudioData && this.widgetResolverAudioData.widgetData) {
          this.widgetResolverAudioData.widgetData['hideUpNext'] = this.hideUpNext
        }
        if (this.audioData && this.audioData.subTitles) {

          let subTitleUrl = ''
          if (this.audioData.subTitles.length > 0 && this.audioData.subTitles[0]) {
            if (this.audioData.subTitles[0].url.indexOf('/content-store/') > -1) {
              subTitleUrl = `/apis/authContent/${new URL(this.audioData.subTitles[0].url).pathname}`
            } else {
              subTitleUrl = `/apis/authContent/${encodeURIComponent(this.audioData.subTitles[0].url)}`
            }
          }
          this.widgetResolverAudioData.widgetData.subtitles = [{
            srclang: '',
            label: '',
            url: subTitleUrl,
          }]
        }

      })
      // this.htmlData = this.viewerDataSvc.resource
    } else {
      this.routeDataSubscription = this.activatedRoute.data.subscribe(
        async data => {
          this.widgetResolverAudioData = null
          this.audioData = data.content.data
          if (this.audioData) {
            this.formDiscussionForumWidget(this.audioData)
          }
          if (this.audioData && this.audioData.artifactUrl.indexOf('content-store') >= 0) {
            await this.setS3Cookie(this.audioData.identifier)
          }
          this.widgetResolverAudioData = this.initWidgetResolverAudioData()
          if (this.activatedRoute.snapshot.queryParams.collectionId) {
            this.widgetResolverAudioData.widgetData.collectionId = this.activatedRoute.snapshot.queryParams.collectionId
          } else {
            this.widgetResolverAudioData.widgetData.collectionId = ''
          }
          if (this.audioData && this.audioData.identifier) {
            if (this.activatedRoute.snapshot.queryParams.collectionId) {
              await this.fetchContinueLearning(
                this.activatedRoute.snapshot.queryParams.collectionId,
                this.audioData.identifier,
              )
            }
            // else {
            //   await this.fetchContinueLearning(this.audioData.identifier, this.audioData.identifier)
            // }
          }
          if (this.forPreview) {
            // this.widgetResolverAudioData.widgetData.disableTelemetry = true
            // TODO: for public couese access forPreview is set to true, but we need telemetry too
            this.widgetResolverAudioData.widgetData.disableTelemetry = false
          }
          if (this.widgetResolverAudioData && this.widgetResolverAudioData.widgetData) {
            this.widgetResolverAudioData.widgetData['hideUpNext'] = this.hideUpNext
          }
          this.widgetResolverAudioData.widgetData.mimeType = data.content.data.mimeType
          this.widgetResolverAudioData.widgetData.contentType = data.content.data.contentType
          this.widgetResolverAudioData.widgetData.primaryCategory = data.content.data.primaryCategory

          this.widgetResolverAudioData.widgetData.version = `${data.content.data.version}${''}`
          this.widgetResolverAudioData.widgetData.channel = this.channelId

          if (data.content.data && data.content.data.subTitles && data.content.data.subTitles[0]) {

            let subTitlesUrl = ''
            if (data.content.data.subTitles[0].url.indexOf('/content-store/') > -1) {
              subTitlesUrl = `/apis/authContent/${new URL(data.content.data.subTitles[0].url).pathname}`
            } else {
              subTitlesUrl = `/apis/authContent/${encodeURIComponent(data.content.data.subTitles[0].url)}`
            }
            this.widgetResolverAudioData.widgetData.subtitles = [{
              srclang: '',
              label: '',
              url: subTitlesUrl,
            }]

          }

          // this.widgetResolverAudioData.widgetData.url = this.audioData
          //   ? this.forPreview
          //     ? this.viewerSvc.getAuthoringUrl(this.audioData.artifactUrl)
          //     : this.audioData.artifactUrl
          //   : ''
          if (this.audioData) {
            // tslint:disable-next-line: max-line-length
            this.widgetResolverAudioData.widgetData.url = this.viewerSvc.getPublicUrl(this.audioData.artifactUrl) || this.audioData.artifactUrl
          }
          this.widgetResolverAudioData.widgetData.identifier = this.audioData
            ? this.audioData.identifier
            : ''
          this.widgetResolverAudioData = JSON.parse(JSON.stringify(this.widgetResolverAudioData))
          this.isFetchingDataComplete = true

        },
        () => { },
      )
    }
  }

  generateUrl(oldUrl: string) {
    const chunk = oldUrl.split('/')
    const newChunk = environment.azureHost.split('/')
    const newLink = []
    for (let i = 0; i < chunk.length; i += 1) {
      if (i === 2) {
        newLink.push(newChunk[i])
      } else if (i === 3) {
        newLink.push(environment.azureBucket)
      } else {
        newLink.push(chunk[i])
      }
    }
    const newUrl = newLink.join('/')
    return newUrl
  }

  ngOnDestroy() {
    if (this.routeDataSubscription) {
      this.routeDataSubscription.unsubscribe()
    }
    if (this.screenSizeSubscription) {
      this.screenSizeSubscription.unsubscribe()
    }
    if (this.viewerDataSubscription) {
      this.viewerDataSubscription.unsubscribe()
    }
  }

  initWidgetResolverAudioData() {
    return {
      widgetType: 'player',
      widgetSubType: 'playerAudio',
      widgetData: {
        disableTelemetry: false,
        url: '',
        identifier: '',
        resumePoint: 0,
        continueLearning: true,
        mimeType: '',
        collectionId: '',
      },
      widgetHostClass: 'video-full',
    }
  }

  formDiscussionForumWidget(content: NsContent.IContent) {
    this.discussionForumWidget = {
      widgetData: {
        description: content.description,
        id: content.identifier,
        name: NsDiscussionForum.EDiscussionType.LEARNING,
        title: content.name,
        initialPostCount: 2,
        isDisabled: this.forPreview,
      },
      widgetSubType: 'discussionForum',
      widgetType: 'discussionForum',
    }
  }

  async fetchContinueLearning(collectionId: string, audioId: string): Promise<boolean> {
    return new Promise(resolve => {
      this.contentSvc.fetchContentHistory(collectionId).subscribe(
        data => {
          if (data) {
            if (
              data.identifier === audioId &&
              data.continueData &&
              data.continueData.progress &&
              this.widgetResolverAudioData
            ) {
              this.widgetResolverAudioData.widgetData.resumePoint = Number(
                data.continueData.progress,
              )
            }
          }
          resolve(true)
        },
        () => resolve(true),
      )
    })
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
