import { NestedTreeControl } from '@angular/cdk/tree'
import { Component, EventEmitter, OnDestroy, OnInit, Output, Input } from '@angular/core'
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'
import { ActivatedRoute, NavigationExtras, Params } from '@angular/router'
import {
  // ContentProgressService,
  NsContent,
  VIEWER_ROUTE_FROM_MIME,
  WidgetContentService,
} from '@sunbird-cb/collection'
import { NsWidgetResolver } from '@sunbird-cb/resolver'
import { WidgetUserServiceLib } from '@sunbird-cb/consumption'
import {
  // LoggerService,
  ConfigurationsService,
  EventService,
  UtilityService,
  WsEvents,
} from '@sunbird-cb/utils-v2'
// tslint:disable-next-line
import _ from 'lodash'
import { of, Subscription } from 'rxjs'
import { delay } from 'rxjs/operators'
import { ViewerDataService } from '../../viewer-data.service'
import { ViewerUtilService } from '../../viewer-util.service'
import { MatTreeNestedDataSource } from '@angular/material/tree'
// import { AppTocService } from '@ws/app/src/lib/routes/app-toc/services/app-toc.service'
export interface IViewerTocCard {
  identifier: string
  viewerUrl: string
  thumbnailUrl: string
  title: string
  duration: number
  type: string
  mimeType: NsContent.EMimeTypes
  complexity: string
  children: null | IViewerTocCard[]
  primaryCategory: NsContent.EPrimaryCategory
  collectionId: string | null
  collectionType: string,
  batchId: string | number,
  viewMode: string,
  optionalReading: boolean,
  channelId: string
}

export type TCollectionCardType = 'content' | 'playlist' | 'goals'

interface ICollectionCard {
  type: TCollectionCardType | null
  id: string
  title: string
  thumbnail: string
  subText1: string
  subText2: string
  duration: number
  redirectUrl: string | null
  queryParams: Params
}

@Component({
  selector: 'viewer-viewer-toc',
  templateUrl: './viewer-toc.component.html',
  styleUrls: ['./viewer-toc.component.scss'],
})
export class ViewerTocComponent implements OnInit, OnDestroy {
  @Output() hidenav = new EventEmitter<boolean>()
  @Input() forPreview = false
  @Input() contentData: any = {}

  @Input() batchData: any
  @Input() tocStructure: any
  @Input() hierarchyMapData: any = {}
  @Input() config: any
  @Input() isPreAssessment = false
  @Input() baseContentReadData!: any
  @Output() pathSetEvent = new EventEmitter()

  constructor(
    private activatedRoute: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    // private logger: LoggerService,
    private contentSvc: WidgetContentService,
    private utilitySvc: UtilityService,
    private viewerDataSvc: ViewerDataService,
    private viewSvc: ViewerUtilService,
    private configSvc: ConfigurationsService,
    // private contentProgressSvc: ContentProgressService,
    private userSvc: WidgetUserServiceLib,
    public eventSvc: EventService
    // private tocSvc: AppTocService,
  ) {
    this.nestedTreeControl = new NestedTreeControl<IViewerTocCard>(this._getChildren)
    this.nestedDataSource = new MatTreeNestedDataSource()
  }
  resourceId: any | null = null
  collection: IViewerTocCard | null = null
  collectionType = 'course'
  collectionId: string | null = ''
  channelId: any
  batchId: any
  viewMode = 'START'
  queue: IViewerTocCard[] = []
  tocMode: 'FLAT' | 'TREE' = 'FLAT'
  nestedTreeControl: NestedTreeControl<IViewerTocCard>
  nestedDataSource: MatTreeNestedDataSource<IViewerTocCard>
  defaultThumbnail: SafeUrl | null = null
  isFetching = true
  pathSet: any
  contentProgressHash: { [id: string]: number } | null = null
  errorWidgetData: NsWidgetResolver.IRenderConfigWithTypedData<any> = {
    widgetType: 'errorResolver',
    widgetSubType: 'errorResolver',
    widgetData: {
      errorType: '',
    },
  }
  enumContentTypes = NsContent.EDisplayContentTypes
  collectionCard: ICollectionCard | null = null
  isErrorOccurred = false
  private paramSubscription: Subscription | null = null
  private viewerDataServiceSubscription: Subscription | null = null
  hierarchyData: any
  enrollmentList: any
  enableAITutorFlag = false
  aiTutorResourceId: any = ''
  showAITutorFlag = true
  scormAssessmentCount = 0
  totalResource = 0
  defaultTabIndex = 0
  fromAITutor: any = false
  isMobile = false
  userInfo: any
  userDesignation: any = ''
  // tslint:disable-next-line
  hasNestedChild = (_: number, nodeData: IViewerTocCard) =>
    nodeData && nodeData.children && nodeData.children.length
  private _getChildren = (node: IViewerTocCard) => {
    return node && node.children ? node.children : []
  }

  ngOnInit() {
    this.isMobile = this.utilitySvc.isMobile
    this.userInfo = this.configSvc && this.configSvc.userProfile
    if (this.userInfo?.professionalDetails && this.userInfo?.professionalDetails?.length) {
      this.userDesignation = this.userInfo?.professionalDetails[0]['designation']?.trim()
    }
    if (this.configSvc.iGOTAIConfig && this.configSvc.iGOTAIConfig?.aiTutor?.all) {
      if (this.configSvc.iGOTAIConfig?.aiTutor?.allDesignation) {
        this.enableAITutorFlag = true
      }
      else if (this.configSvc.iGOTAIConfig?.aiTutor?.forDesignation?.includes(this.userDesignation)) {
        this.enableAITutorFlag = true
      }
    } else if (this.configSvc.iGOTAIConfig && this.configSvc.iGOTAIConfig?.aiTutor && this.configSvc.iGOTAIConfig?.aiTutor?.forOrg && this.configSvc.iGOTAIConfig?.aiTutor?.forOrg?.length &&
      this.configSvc.iGOTAIConfig?.aiTutor?.forOrg?.includes(this.configSvc.userProfile?.rootOrgId)
    ) {
      if (this.configSvc.iGOTAIConfig?.aiTutor?.allDesignation) {
        this.enableAITutorFlag = true
      }
      else if (this.configSvc.iGOTAIConfig?.aiTutor?.forDesignation?.includes(this.userDesignation)) {
        this.enableAITutorFlag = true
      }
    } else {
      this.enableAITutorFlag = false
    }
    this.hierarchyData = this.activatedRoute.snapshot.data.hierarchyData
      && this.activatedRoute.snapshot.data.hierarchyData.data || ''
    if (this.hierarchyData && this.hierarchyData.result
      && this.hierarchyData.result.content
      && this.hierarchyData.result.content.children) {
      this.showAITutorFlag = this.onlyscormAssessmentExists(this.hierarchyData.result.content.children, 'mimeType', ['application/vnd.ekstep.html-archive', 'application/vnd.sunbird.questionset', 'application/json', 'text/x-url'])
    }

    this.enrollmentList = this.activatedRoute.snapshot.data.enrollmentData
      && this.activatedRoute.snapshot.data.enrollmentData.data || ''
    const contentRead = this.activatedRoute.snapshot.data.contentRead
      && this.activatedRoute.snapshot.data.contentRead.data || ''
    if (contentRead.result && contentRead.result.content) {
      this.contentSvc.currentContentReadMetaData = contentRead.result.content
      this.aiTutorResourceId = contentRead.result.content.identifier
    }
    // tslint:disable-next-line
    //  console.log(this.hierarchyData,'hierarchyData')
    // tslint:disable-next-line
    //  console.log(contentRead,'contentRead')


    if (this.configSvc.instanceConfig && this.configSvc.instanceConfig.logos) {
      const logo = this.configSvc.instanceConfig.logos.defaultContent || ''
      this.defaultThumbnail = this.domSanitizer.bypassSecurityTrustResourceUrl(logo)
    }

    const forPreview = window.location.href.includes('/public/') || window.location.href.includes('&preview=true')
    if (!forPreview) {
      this.getEnrollmentList()
    }

    this.paramSubscription = this.activatedRoute.queryParamMap.subscribe(async params => {

      this.collectionId = params.get('collectionId')
      this.collectionType = params.get('collectionType') || 'course'
      const primaryCategory = params.get('primaryCategory')
      this.viewMode = params.get('viewMode') || 'START'
      this.forPreview = params.get('preview') === 'true' ? true : false
      this.channelId = params.get('channelId')
      this.fromAITutor = params.get('fromAITutor')
      if (this.fromAITutor === true || this.fromAITutor === 'true') {
        this.defaultTabIndex = 1
      }
      try {
        this.batchId = params.get('batchId')
      } catch {
        this.batchId = 0
      }

      if (this.collectionId && this.collectionType && primaryCategory) {
        if (
          this.collectionType.toLowerCase() ===
          NsContent.EMiscPlayerSupportedCollectionTypes.PLAYLIST.toLowerCase()
        ) {
          this.collection = await this.getPlaylistContent(this.collectionId, primaryCategory)
        } else if (
          this.collectionType.toLowerCase() === NsContent.EPrimaryCategory.MODULE.toLowerCase() ||
          this.collectionType.toLowerCase() === NsContent.EPrimaryCategory.COURSE.toLowerCase() ||
          this.collectionType.toLowerCase() === NsContent.EPrimaryCategory.PROGRAM.toLowerCase() ||
          this.collectionType.toLowerCase() === NsContent.EPrimaryCategory.CURATED_PROGRAM.toLowerCase() ||
          this.collectionType.toLowerCase() === NsContent.EPrimaryCategory.STANDALONE_ASSESSMENT.toLowerCase() ||
          this.collectionType.toLowerCase() === NsContent.EPrimaryCategory.BLENDED_PROGRAM.toLowerCase()
        ) {
          this.collection = await this.getCollection(this.collectionId, this.collectionType)
          // this.collection = _.get(this.hierarchyData, 'result.content')
        } else {
          this.isErrorOccurred = true
        }
        if (this.collection) {
          if (this.forPreview) {
            const localQueue = this.utilitySvc.getLeafNodes(this.collection, [])
            this.queue = _.compact(_.map(localQueue, q => {
              if (NsContent.PUBLIC_SUPPORTED_CONTENT_TYPES.includes(q.mimeType)) {
                return q
              } return null
            }))
            if (this.resourceId) {
              this.processCurrentResourceChange()
            }
          } else {
            if (this.isPreAssessment) {
              this.queue = this.getLeafNodes(this.contentData['preEnrolmentResources'], [])
              this.queue.map((item: any) => {
                if (this.collection) {
                  item['collectionId'] = this.collection.identifier
                  item['batchId'] = this.collection.batchId
                  if (item?.courseCategory === 'Pre Enrolment Assessment') {
                    item['mimeType'] = 'application/vnd.sunbird.questionset'
                  }
                }

              })
              if (this.resourceId && this.queue.length) {
                this.processCurrentResourceChange()
              }
            } else {
              this.queue = this.utilitySvc.getLeafNodes(this.collection, [])
              if (this.resourceId) {
                this.processCurrentResourceChange()
              }
            }

          }
        }
      }

    })
    this.viewerDataServiceSubscription = this.viewerDataSvc.changedSubject.subscribe(_data => {
      if (this.resourceId !== this.viewerDataSvc.resourceId) {
        if (this.viewerDataSvc && this.viewerDataSvc.resource && this.viewerDataSvc.resource.contextCategory &&
          this.viewerDataSvc.resource.contextCategory === 'Pre Enrolment Assessment' &&
          this.viewerDataSvc.resource.parent
        ) {
          this.resourceId = this.viewerDataSvc.resource.parent
        } else {
          this.resourceId = this.viewerDataSvc.resourceId
        }

        if (this.isPreAssessment) {
          this.queue = this.getLeafNodes(this.contentData['preEnrolmentResources'], [])
          if (this.resourceId && this.queue.length) {
            this.processCurrentResourceChange()
          }
        } else {
          this.processCurrentResourceChange()
        }

      }
    })
  }
  // tslint:disable
  // private getContentProgressHash() {
  //   if (this.collection && this.batchId && this.configSvc.userProfile) {
  //     if (this.resourceId) {
  //       const requestCourse = this.viewSvc.getBatchIdAndCourseId(this.collection.identifier, this.batchId, this.resourceId)
  //       this.contentProgressSvc
  //       .getProgressHash(requestCourse.courseId, requestCourse.batchId , this.configSvc.userProfile.userId)
  //       .subscribe((progressHash:  any) => {
  //         this.contentProgressHash = progressHash
  //         if(this.collection && this.collection.identifier) {
  //           // this.updateProgressBasedOnHash(progressHash)
  //         }
  //       })
  //     }
  //   }
  // }

  // private updateProgressBasedOnHash(progressHash: any) {
  //     if(
  //       this.contentData.primaryCategory === NsContent.EPrimaryCategory.BLENDED_PROGRAM ||
  //       this.contentData.primaryCategory === NsContent.EPrimaryCategory.CURATED_PROGRAM ||
  //       this.contentData.primaryCategory === NsContent.EPrimaryCategory.PROGRAM
  //     ) {
  //       this.contentSvc.programChildCourseResumeData$.subscribe((data) => {
  //         console.log('updateProgressBasedOnHash data', data)
  //         if(data) {
  //           this.contentData.children && this.contentData.children.forEach((item: any)=>{
  //             if(
  //               item.primaryCategory === NsContent.EPrimaryCategory.COURSE &&
  //               item.identifier === data.courseId
  //             ){
  //               this.tocSvc.mapCompletionPercentage(item, data.resumeData)
  //               this.tocSvc.mapModuleDurationAndProgress(item, item)
  //             }
  //           })
  //         }
  //       })
  //       // this.tocSvc.mapCompletionPercentageProgram(this.contentData, this.enrollmentList.courses)
  //     } else {
  //       this.tocSvc.mapCompletionPercentage(this.contentData, progressHash.result.contentList)
  //       this.tocSvc.mapModuleDurationAndProgress(this.contentData, this.contentData)
  //     }
  // }

  // tslint:enable
  ngOnDestroy() {
    if (this.paramSubscription) {
      this.paramSubscription.unsubscribe()
    }
    if (this.viewerDataServiceSubscription) {
      this.viewerDataServiceSubscription.unsubscribe()
    }
  }
  changeTocMode() {
    if (this.tocMode === 'FLAT') {
      this.tocMode = 'TREE'
      // this.processCollectionForTree()
    } else {
      this.tocMode = 'FLAT'
    }
  }
  getParams(content: IViewerTocCard): NavigationExtras {
    return {
      queryParams: {
        primaryCategory: content.primaryCategory,
        collectionId: content.collectionId,
        collectionType: content.collectionType,
        batchId: content.batchId,
        viewMode: content.viewMode,
        preview: this.forPreview,
      },
      fragment: '',
    }
  }
  private processCurrentResourceChange() {
    if (this.collection && this.resourceId) {
      const currentIndex = this.queue.findIndex(c => c.identifier === this.resourceId)
      // console.log('this.contentData', this.contentData)
      // console.log('this.queue', this.queue)
      // console.log('this.resourceId', this.resourceId)
      if (this.queue && currentIndex > -1) {
        if (this.queue[currentIndex] && this.queue[currentIndex].identifier) {
          // this.aiTutorResourceId = this.queue[currentIndex].identifier
        }
      }
      // console.log('currentIndex' , currentIndex)
      const next =
        currentIndex + 1 < this.queue.length ? this.queue[currentIndex + 1] : null
      const prev = currentIndex - 1 >= 0 ? this.queue[currentIndex - 1] : null
      // console.log('pre', prev)
      // console.log('next', next)
      if (this.queue && this.queue.length) {
        this.viewerDataSvc.updateNextPrevResource(Boolean(this.collection), prev, next, this.getMLQueryParam())
        this.processCollectionForTree()
        this.expandThePath()
      }

      // if (next && next.viewerUrl === '0') { // temp
      // this.getContentProgressHash()
      // }
    }
  }

  getMLQueryParam() {
    const queryMLParams: any = {}
    if (this.activatedRoute.snapshot.queryParams && this.activatedRoute.snapshot.queryParams.ML &&
      this.activatedRoute.snapshot.queryParams.MLId
    ) {
      queryMLParams['ML'] = this.activatedRoute.snapshot.queryParams.ML
      queryMLParams['MLId'] = this.activatedRoute.snapshot.queryParams.MLId
      return queryMLParams
    }
    return null
  }
  private async getCollection(
    collectionId: string,
    _collectionType: string,
  ): Promise<IViewerTocCard | null> {
    try {
      let content: NsContent.IContentResponse | NsContent.IContent
      if (collectionId) {
        if (this.hierarchyData) {
          content = this.hierarchyData
        } else {
          content = await (this.forPreview
            ? this.contentSvc.fetchAuthoringContent(collectionId, 'read')
            : this.contentSvc.fetchContent(collectionId, 'detail', [], _collectionType)
          ).toPromise()
        }
        const contentData = content.result.content
        this.collection = content.result.content
        this.contentSvc.currentMetaData = contentData
        this.collectionCard = this.createCollectionCard(contentData)
        const viewerTocCardContent = this.convertContentToIViewerTocCard(contentData)
        this.isFetching = false
        // console.log('this.collection--', this.collection)
        return viewerTocCardContent
      }
      return null
    } catch (err: any) {
      switch (err && err.status) {
        case 403: {
          this.errorWidgetData.widgetData.errorType = 'accessForbidden'
          break
        }
        case 404: {
          this.errorWidgetData.widgetData.errorType = 'notFound'
          break
        }
        case 500: {
          this.errorWidgetData.widgetData.errorType = 'internalServer'
          break
        }
        case 503: {
          this.errorWidgetData.widgetData.errorType = 'serviceUnavailable'
          break
        }
        default: {
          this.errorWidgetData.widgetData.errorType = 'somethingWrong'
          break
        }
      }
      this.isFetching = false
      return null
    }
  }

  getEnrollmentList() {
    if (this.enrollmentList) {
      this.contentSvc.currentBatchEnrollmentList = this.enrollmentList.courses
    } else {
      let userId
      if (this.configSvc.userProfile) {
        userId = this.configSvc.userProfile.userId || ''
      }
      this.userSvc.fetchUserBatchList(userId).subscribe(
        (result: any) => {
          const courses: NsContent.ICourse[] = result && result.courses
          this.contentSvc.currentBatchEnrollmentList = courses
        })
    }
  }

  private async getPlaylistContent(
    collectionId: string,
    _collectionType: string,
  ): Promise<IViewerTocCard | null> {
    try {
      const playlistFetchResponse = await this.contentSvc
        .fetchCollectionHierarchy('playlist', collectionId, 0, 1000)
        .toPromise()

      const content: NsContent.IContent = playlistFetchResponse.data
      this.collectionCard = this.createCollectionCard(content)
      const viewerTocCardContent = this.convertContentToIViewerTocCard(content)
      this.isFetching = false
      console.log('content', content)
      return viewerTocCardContent
    } catch (err: any) {
      switch (err && err.status) {
        case 403: {
          this.errorWidgetData.widgetData.errorType = 'accessForbidden'
          break
        }
        case 404: {
          this.errorWidgetData.widgetData.errorType = 'notFound'
          break
        }
        case 500: {
          this.errorWidgetData.widgetData.errorType = 'internalServer'
          break
        }
        case 503: {
          this.errorWidgetData.widgetData.errorType = 'serviceUnavailable'
          break
        }
        default: {
          this.errorWidgetData.widgetData.errorType = 'somethingWrong'
          break
        }
      }
      this.isFetching = false
      return null
    }
  }

  private convertContentToIViewerTocCard(content: NsContent.IContent): IViewerTocCard {
    // return {
    //   identifier: content.identifier,
    //   viewerUrl: `/viewer/${VIEWER_ROUTE_FROM_MIME(content.mimeType)}/${content.identifier}`,
    //   thumbnailUrl: content.appIcon,
    //   title: content.name,
    //   duration: content.duration,
    //   type: content.displayContentType,
    //   complexity: content.difficultyLevel,
    //   children: Array.isArray(content.children) && content.children.length ?
    //     content.children.map(child => this.convertContentToIViewerTocCard(child)) : null,
    // }
    return {
      identifier: content.identifier,
      viewerUrl: `${this.forPreview ? '' : ''}/viewer/${VIEWER_ROUTE_FROM_MIME(
        content.mimeType,
        // )}/${content.identifier}?primaryCategory=${content.primaryCategory}
        // &collectionId=${this.viewerDataSvc.collectionId}&collectionType=${this.collectionType}
        // &batchId=${this.batchId}&viewMode=${this.viewMode}`,
      )}/${content.identifier}`,
      thumbnailUrl: this.forPreview
        ? this.viewSvc.getAuthoringUrl(content.appIcon)
        : content.appIcon,
      title: content.name,
      duration: content.duration,
      collectionId: this.collectionId,
      collectionType: this.collectionType,
      batchId: this.batchId,
      viewMode: this.viewMode,
      type: content.primaryCategory,
      mimeType: content.mimeType,
      complexity: content.difficultyLevel || 'Easy',
      primaryCategory: content.primaryCategory,
      optionalReading: content.optionalReading,
      channelId: this.channelId,
      children:
        Array.isArray(content.children) && content.children.length
          && content.mimeType !== NsContent.EMimeTypes.QUESTION_SET // this is because of ne api ( questionset structure)
          ? content.children.map(child => this.convertContentToIViewerTocCard(child))
          : null,
    }
  }

  private createCollectionCard(
    collection: NsContent.IContent | NsContent.IContentMinimal,
  ): ICollectionCard {
    // return {
    //   type: this.getCollectionTypeCard(collection.displayContentType),
    //   id: collection.identifier,
    //   title: collection.name,
    //   thumbnail: collection.appIcon,
    //   subText1: collection.displayContentType || collection.contentType,
    //   subText2: collection.difficultyLevel,
    //   duration: collection.duration,
    //   redirectUrl: this.getCollectionTypeRedirectUrl(collection.displayContentType, collection.identifier),
    // }
    const img = collection.posterImage ? collection.posterImage : collection.appIcon
    return {
      type: this.getCollectionTypeCard(collection.primaryCategory),
      id: collection.identifier,
      title: collection.name,
      thumbnail: this.forPreview
        ? this.viewSvc.getAuthoringUrl(this.viewSvc.getPublicUrl(img))
        : this.viewSvc.getPublicUrl(img),
      subText1: collection.primaryCategory,
      subText2: collection.difficultyLevel,
      duration: collection.duration,
      redirectUrl: this.getCollectionTypeRedirectUrl(
        collection.identifier,
        // collection.primaryCategory,
        collection.primaryCategory,
      ),
      queryParams: { batchId: this.batchId },
    }
  }

  private getCollectionTypeCard(
    displayContentType?: NsContent.EPrimaryCategory,
  ): TCollectionCardType | null {
    switch (displayContentType) {
      case NsContent.EPrimaryCategory.PROGRAM:
      case NsContent.EPrimaryCategory.COURSE:
      case NsContent.EPrimaryCategory.MODULE:
        return 'content'
      case NsContent.EPrimaryCategory.GOALS:
        return 'goals'
      case NsContent.EPrimaryCategory.PLAYLIST:
        return 'playlist'
      default:
        return null
    }
  }

  private getCollectionTypeRedirectUrl(
    identifier: string,
    // contentType: string = '',
    displayContentType?: NsContent.EDisplayContentTypes | NsContent.EPrimaryCategory,
  ): string | null {
    let url: string | null
    const dct = (displayContentType || '').toUpperCase()
    switch (dct) {
      case NsContent.EDisplayContentTypes.PROGRAM:
      case NsContent.EDisplayContentTypes.COURSE:
      case NsContent.EDisplayContentTypes.MODULE:
      case NsContent.EDisplayContentTypes.STANDALONE_ASSESSMENT:
      case NsContent.EDisplayContentTypes.BLENDED_PROGRAM:
      case NsContent.EDisplayContentTypes.CURATED_PROGRAM:
        if (!this.forPreview) {
          url = `${this.forPreview ? '' : '/app'}/toc/${identifier}/overview`
        } else {
          url = `public/toc/${identifier}/overview`
        }
        break
      case NsContent.EDisplayContentTypes.GOALS:
        url = `/app/goals/${identifier}`
        break
      case NsContent.EDisplayContentTypes.PLAYLIST:
        url = `/app/playlist/${identifier}`
        break
      default:
        url = null
    }
    // if (contentType) {
    //   url = `${url}?primaryCategory=${contentType}`
    // }
    return url
  }

  private processCollectionForTree() {
    if (this.collection && this.collection.children) {
      this.nestedDataSource.data = this.collection.children
      // this.pathSet = new Set()
      // if (this.resourceId && this.tocMode === 'TREE') {
      if (this.resourceId) {
        of(true)
          .pipe(delay(2000))
          .subscribe(() => {
            this.expandThePath()
          })
      }
      // }
    }
  }

  expandThePath() {
    // console.log('this.collection', this.contentData)
    // console.log('this.resourceId', this.resourceId)
    if (this.collection && this.resourceId && !this.isPreAssessment) {
      const path = this.utilitySvc.getPath(this.collection, this.resourceId)
      this.pathSet = new Set(path.map((u: { identifier: any }) => u.identifier))
      // console.log('this.pathSet', this.pathSet)
      this.pathSetEvent.emit({ pathSet: this.pathSet })
      // path.forEach((node: IViewerTocCard) => {
      //   this.nestedTreeControl.expand(node)
      // })
    } else if (this.isPreAssessment && this.resourceId && this.contentData) {
      const path = this.getPath(this.contentData, this.resourceId)
      this.pathSet = new Set(path.map((u: { identifier: any }) => u.identifier))
      this.pathSetEvent.emit({ pathSet: this.pathSet })
    }
  }

  getPath(node: any, id: string): any[] {
    const path: any = []
    this.hasPath(node, path, id)
    return path
  }

  private hasPath(node: any, pathArr: any[], id: string): boolean {
    if (node == null) {
      return false
    }
    pathArr.push(node)
    if (node.identifier === id) {
      return true
    }
    const children = node.preEnrolmentResources || []
    if (children.some((u: any) => this.hasPath(u, pathArr, id))) {
      return true
    }
    pathArr.pop()
    return false
  }

  minimizenav() {
    this.hidenav.emit(false)
  }

  onlyscormAssessmentExists(data: any, key: any, value: any) {
    for (let i = 0; i < data?.length; i++) {
      if (data[i] && data[i]['children'] && data[i]['children'].length) {
        // this.totalResource = this.totalResource + 1
        this.onlyscormAssessmentExists(data[i]?.children, key, value)
      } else {
        this.totalResource = this.totalResource + 1
        if (value.includes(data[i][key])) {
          // this.showAITutorFlag = false;
          this.scormAssessmentCount = this.scormAssessmentCount + 1
        }
      }
    }
    // console.log('this.totalResource',this.totalResource)
    // console.log('this.scormAssessmentCount',this.scormAssessmentCount)
    if (this.totalResource === this.scormAssessmentCount) {
      this.showAITutorFlag = false
    } else {
      this.showAITutorFlag = true
    }
    return this.showAITutorFlag
  }

  onTabChanged(event: any) {
    // console.log('contentData', this.contentData)
    if (event && event.index && event.index === 1) {
      this.raiseAITutorStartTelemetry()
      this.raiseAITutorInteractTelemetry()
    } else {
      this.raiseAITutorEndTelemetry()
    }

  }

  raiseAITutorStartTelemetry() {
    const event = {
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      data: {
        edata: { type: 'click', "id": "ai-tutor-player-page", "pageid": `/viewer/${this.contentData?.identifier}` },
        object: { "id": this.contentData?.identifier, "type": this.contentData?.courseCategory },
        state: WsEvents.EnumTelemetrySubType.Loaded,
        eventSubType: WsEvents.EnumTelemetrySubType.Chatbot,
        mode: 'view',
      },
      pageContext: { pageId: '/viewer', module: 'Learn' },
      from: '',
      to: 'Telemetry',
    }
    this.eventSvc.dispatchChatbotEvent<WsEvents.IWsEventTelemetryInteract>(event)
  }


  raiseAITutorEndTelemetry() {
    const event = {
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      data: {
        edata: { type: 'click', "id": "ai-tutor-player-page", "pageid": `/viewer/${this.contentData?.identifier}` },
        object: { "id": this.contentData?.identifier, "type": this.contentData?.courseCategory },
        state: WsEvents.EnumTelemetrySubType.Unloaded,
        eventSubType: WsEvents.EnumTelemetrySubType.Chatbot,
        mode: 'view',
      },
      pageContext: { pageId: '/viewer', module: 'Learn' },
      from: '',
      to: 'Telemetry',
    }
    this.eventSvc.dispatchChatbotEvent<WsEvents.IWsEventTelemetryInteract>(event)
  }

  raiseAITutorInteractTelemetry() {
    const event = {
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      data: {
        edata: { type: 'click', "id": "ai-tutor-player-page", "pageid": `/viewer/${this.contentData?.identifier}` },
        object: { "id": this.contentData?.identifier, "type": this.contentData?.courseCategory },
        state: WsEvents.EnumTelemetrySubType.Interact,
        eventSubType: WsEvents.EnumTelemetrySubType.Chatbot,
        mode: 'view',
      },
      pageContext: { pageId: '/viewer', module: 'Learn' },
      from: '',
      to: 'Telemetry',
    }
    this.eventSvc.dispatchChatbotEvent<WsEvents.IWsEventTelemetryInteract>(event)
  }

  getLeafNodes(node: any, nodes: any[]): any[] {
    if (Array.isArray(node)) {
      if (node.length === 0) {
        // empty array
        return nodes
      } else {
        // node is an array with items
        node.forEach((child: any) => {
          this.getLeafNodes(child, nodes)
        })
      }
    } else if (node) {
      // node is a single object
      nodes.push(node)
    }

    return nodes
  }
}
