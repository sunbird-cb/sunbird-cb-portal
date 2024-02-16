import { Component, Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core'
import { ActivatedRoute, Data } from '@angular/router'
import { NsWidgetResolver } from '@sunbird-cb/resolver/src/public-api'
import { ConfigurationsService, UtilityService } from '@sunbird-cb/utils'
import {
  WidgetContentService,
} from '@sunbird-cb/collection'
import { NsContent } from '@sunbird-cb/utils/src/public-api'
import { AppTocService } from '@ws/app/src/lib/routes/app-toc/services/app-toc.service'
import { Subscription } from 'rxjs'
import { NsAppToc } from '../models/app-toc.model'

@Component({
  selector: 'ws-widget-app-toc-content',
  templateUrl: './app-toc-content.component.html',
  styleUrls: ['./app-toc-content.component.scss'],
})

export class AppTocContentComponent implements OnInit, OnDestroy {
  @Input() batchId!: string
  @Input() content!: NsContent.IContent
  @Input() forPreview = false
  @Input() resumeData: NsContent.IContinueLearningData | null = null
  @Input() batchData: /**NsContent.IBatchListResponse */ any | null = null
  @Input() skeletonLoader = false
  @Input() tocStructure: any
  @Input() config: any
  isPlayable = false
  contentPlayWidgetConfig: NsWidgetResolver.IRenderConfigWithTypedData<any> | null = null
  defaultThumbnail = ''
  errorCode: NsAppToc.EWsTocErrorCode | null = null
  private routeSubscription: Subscription | null = null
  private routeQuerySubscription: Subscription | null = null
  contentParents: NsContent.IContentMinimal[] = []
  expandAll = false
  expandPartOf = false
  contextId!: string
  contextPath!: string

  typesOfContent: any
  selectedTabType: any = 'content'
  nsContent: any =  NsContent
  otherResourse = 0
  @Input() pathSet = new Set()

  constructor(
    private route: ActivatedRoute,
    private tocSvc: AppTocService,
    private configSvc: ConfigurationsService,
    private utilitySvc: UtilityService,
    private contentSvc: WidgetContentService,
  ) {
    this.tocSvc.resumeData.subscribe((res: any) => {
      this.resumeData = res
      // this.getLastPlayedResource()
    })
  }

  ngOnInit() {
    // this.forPreview = window.location.href.includes('/author/')
    this.routeQuerySubscription = this.route.queryParamMap.subscribe(qParamsMap => {
      const contextId = qParamsMap.get('contextId')
      const contextPath = qParamsMap.get('contextPath')
      const batchId = qParamsMap.get('batchId')
      if (contextId && contextPath) {
        this.contextId = contextId
        this.contextPath = contextPath
      }
      if (batchId) {
        this.batchId = batchId
      }
    })
    if (this.route && this.route.parent) {
      this.routeSubscription = this.route.parent.data.subscribe((data: Data) => {
        this.initData(data)
      })
    }
    const instanceConfig = this.configSvc.instanceConfig
    if (instanceConfig) {
      this.defaultThumbnail = instanceConfig.logos.defaultContent || ''
    }
    this.typesOfContent = [
      {
        name: 'Self-paced',
        id: 'content',
        disabled: false,
      },
      {
        name: 'Instructor-led',
        id: 'session',
        disabled: false,
      },
    ]
    this.otherResourse = 0
    if(this.tocStructure){
      Object.keys(this.tocStructure).forEach((ele: any) => {
        if (ele === 'offlineSession' || ele === 'learningModule') {
        } else {
  
          this.otherResourse = this.otherResourse + this.tocStructure[ele]
        }
      })
      if (!this.otherResourse) {
        setTimeout(() => {
          this.selectedTabType = 'session'
          this.typesOfContent[0].disabled = true
        },         1000)
      } else {
        this.typesOfContent[1].disabled =  this.tocStructure['offlineSession'] ? false : true
      }
    }
  }

  private initData(data: Data) {
    const initData = this.tocSvc.initData(data, true)
    // this.content = initData.content
    this.errorCode = initData.errorCode
    if (this.content) {
      if (!this.contextId || !this.contextPath) {
        this.contextId = this.content.identifier
        this.contextPath = this.content.primaryCategory
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const property in changes) {
      if (property === 'resumeData') {
        // this.getLastPlayedResource()
      }
    }
  }

  // private processCollectionForTree() {
  //     this.pathSet = new Set()
  // }

  // getLastPlayedResource() {
  //   let firstPlayableContent
  //   let resumeDataV2: any
  //   if (this.resumeData && this.resumeData.length > 0 && this.content) {
  //     if (this.content.completionPercentage === 100) {
  //       resumeDataV2 = this.getResumeDataFromList('start')
  //     } else {
  //       resumeDataV2 = this.getResumeDataFromList()
  //     }
  //     this.expandThePath(resumeDataV2.identifier)
  //   } else {
  //     firstPlayableContent = this.contentSvc.getFirstChildInHierarchy(this.content)
  //     this.expandThePath(firstPlayableContent.identifier)
  //   }
  // }

  // expandThePath(resourceId: string) {
  //   if (this.content && resourceId) {
  //     const path = this.utilitySvc.getPath(this.content, resourceId)
  //     // console.log('Path :: :: : ', path)
  //     this.pathSet = new Set(path.map((u: { identifier: any }) => u.identifier))
  //     // console.log('pathSet ::: ', this.pathSet)
  //     // path.forEach((node: IViewerTocCard) => {
  //     //   this.nestedTreeControl.expand(node)
  //     // })
  //   }
  // }

  // private getResumeDataFromList(type?: string) {
  //   if (!type) {
  //     // tslint:disable-next-line:max-line-length
  //     const lastItem = this.resumeData && this.resumeData.sort((a: any, b: any) => new Date(b.lastAccessTime).getTime() - new Date(a.lastAccessTime).getTime()).shift()
  //     return {
  //       identifier: lastItem.contentId,
  //       mimeType: lastItem.progressdetails && lastItem.progressdetails.mimeType,
  //     }
  //   }

  //   const firstItem = this.resumeData && this.resumeData.length && this.resumeData[0]
  //   return {
  //     identifier: firstItem.contentId,
  //     mimeType: firstItem.progressdetails && firstItem.progressdetails.mimeType,
  //   }
  // }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe()
    }
    if (this.routeQuerySubscription) {
      this.routeQuerySubscription.unsubscribe()
    }
  }
}
