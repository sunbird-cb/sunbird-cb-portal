import { Injectable } from '@angular/core'
import { Data } from '@angular/router'
import { Subject, Observable, EMPTY, Subscription } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { NsContent, NsContentConstants } from '@sunbird-cb/collection'
import { NsAppToc, NsCohorts } from '../models/app-toc.model'
import { TFetchStatus, ConfigurationsService } from '@sunbird-cb/utils'
// tslint:disable-next-line
import _ from 'lodash'

// TODO: move this in some common place
const PROTECTED_SLAG_V8 = '/apis/protected/v8'
const PROXY_SLAG_V8 = '/apis/proxies/v8'

const API_END_POINTS = {
  BATCH_CREATE: `${PROXY_SLAG_V8}/learner/course/v1/batch/create`,
  CONTENT_PARENTS: `${PROTECTED_SLAG_V8}/content/parents`,
  CONTENT_NEXT: `${PROTECTED_SLAG_V8}/content/next`,
  CONTENT_PARENT: (contentId: string) => `${PROTECTED_SLAG_V8}/content/${contentId}/parent`,
  CONTENT_AUTH_PARENT: (contentId: string, rootOrg: string, org: string) =>
    `/apis/authApi/action/content/parent/hierarchy/${contentId}?rootOrg=${rootOrg}&org=${org}`,
  COHORTS: (cohortType: NsCohorts.ECohortTypes, contentId: string) =>
    `${PROTECTED_SLAG_V8}/cohorts/${cohortType}/${contentId}`,
  EXTERNAL_CONTENT: (contentId: string) =>
    `${PROTECTED_SLAG_V8}/content/external-access/${contentId}`,
  COHORTS_GROUP_USER: (groupId: number) => `${PROTECTED_SLAG_V8}/cohorts/${groupId}`,
  RELATED_RESOURCE: (contentId: string, contentType: string) =>
    `${PROTECTED_SLAG_V8}/khub/fetchRelatedResources/${contentId}/${contentType}`,
  POST_ASSESSMENT: (contentId: string) =>
    `${PROTECTED_SLAG_V8}/user/evaluate/post-assessment/${contentId}`,
}

@Injectable()
export class AppTocService {
  analyticsReplaySubject: Subject<any> = new Subject()
  analyticsFetchStatus: TFetchStatus = 'none'
  batchReplaySubject: Subject<any> = new Subject()
  setBatchDataSubject: Subject<any> = new Subject()
  resumeData: Subject<NsContent.IContinueLearningData | null> = new Subject<NsContent.IContinueLearningData | null>()
  private showSubtitleOnBanners = false
  private canShowDescription = false
  resumeDataSubscription: Subscription | null = null
  primaryCategory = NsContent.EPrimaryCategory

  constructor(private http: HttpClient, private configSvc: ConfigurationsService) { }

  get subtitleOnBanners(): boolean {
    return this.showSubtitleOnBanners
  }
  set subtitleOnBanners(val: boolean) {
    this.showSubtitleOnBanners = val
  }
  get showDescription(): boolean {
    return this.canShowDescription
  }
  set showDescription(val: boolean) {
    this.canShowDescription = val
  }

  updateBatchData() {
    this.batchReplaySubject.next()
  }

  setBatchData(data: NsContent.IBatchListResponse) {
    this.setBatchDataSubject.next(data)
  }

  updateResumaData(data: any) {
    this.resumeData.next(data)
  }

  showStartButton(content: NsContent.IContent | null): { show: boolean; msg: string } {
    const status = {
      show: false,
      msg: '',
    }
    if (content) {
      if (
        content.artifactUrl && content.artifactUrl.match(/youtu(.)?be/gi) &&
        this.configSvc.userProfile &&
        this.configSvc.userProfile.country === 'China'
      ) {
        status.show = false
        status.msg = 'youtubeForbidden'
        return status
      }
      if (content.resourceType !== 'Certification') {
        status.show = true
        return status
      }
    }
    return status
  }

  initData(data: Data, needResumeData: boolean = false): NsAppToc.IWsTocResponse {
    let content: NsContent.IContent | null = null
    let errorCode: NsAppToc.EWsTocErrorCode | null = null
    if (data.content && data.content.data && data.content.data.identifier) {
      content = data.content.data
      if (needResumeData) {
        this.resumeDataSubscription = this.resumeData.subscribe(
          (dataResult: any) => {
            if (dataResult && dataResult.length) {
              // dataResult.map((item: any) => {
              //   if ( && content.children) {
              //     const foundContent = content.children.find(el => el.identifier === item.contentId)
              //     if (foundContent) {
              //       foundContent.completionPercentage = item.completionPercentage
              //       foundContent.completionStatus = item.status
              //     }
              //   }
              // })
              this.mapCompletionPercentage(content, dataResult)
            }
          },
          () => {
            // tslint:disable-next-line: no-console
            console.log('error on resumeDataSubscription')
          },
        )
      }
    } else {
      if (data.error) {
        errorCode = NsAppToc.EWsTocErrorCode.API_FAILURE
      } else {
        errorCode = NsAppToc.EWsTocErrorCode.NO_DATA
      }
    }
    return {
      content,
      errorCode,
    }
  }

  mapCompletionPercentage(content: NsContent.IContent | null, dataResult: any) {
    if (content && content.children) {
      content.children.map(child => {
        const foundContent = dataResult.find((el: any) => el.contentId === child.identifier)
        if (foundContent) {
          child.completionPercentage = foundContent.completionPercentage
          child.completionStatus = foundContent.status
        } else {
          this.mapCompletionPercentage(child, dataResult)
        }
      })
    }
  }

  getTocStructure(
    content: NsContent.IContent,
    tocStructure: NsAppToc.ITocStructure,
  ): NsAppToc.ITocStructure {
    if (
      content &&
      !(content.primaryCategory === this.primaryCategory.RESOURCE
        // || content.primaryCategory === this.primaryCategory.KNOWLEDGE_ARTIFACT)
        || content.primaryCategory === this.primaryCategory.PRACTICE_RESOURCE
      )) {
      if (content.primaryCategory === NsContent.EPrimaryCategory.COURSE) {
        tocStructure.course += 1
      } else if (content.primaryCategory === NsContent.EPrimaryCategory.MODULE) {
        tocStructure.learningModule += 1
      }
      _.each(content.children, child => {
        // tslint:disable-next-line: no-parameter-reassignment
        tocStructure = this.getTocStructure(child, tocStructure)
      })
    } else if (
      content &&
      (
        content.primaryCategory === NsContent.EPrimaryCategory.RESOURCE
        // || content.contentType === 'Knowledge Artifact'
        || content.primaryCategory === NsContent.EPrimaryCategory.PRACTICE_RESOURCE)
    ) {
      switch (content.mimeType) {
        // case NsContent.EMimeTypes.HANDS_ON:
        //   tocStructure.handsOn += 1
        //   break
        case NsContent.EMimeTypes.MP3:
          tocStructure.podcast += 1
          break
        case NsContent.EMimeTypes.MP4:
        case NsContent.EMimeTypes.M3U8:
        case NsContent.EMimeTypes.YOUTUBE:
          tocStructure.video += 1
          break
        // case NsContent.EMimeTypes.INTERACTION:
        //   tocStructure.interactiveVideo += 1
        //   break
        case NsContent.EMimeTypes.PDF:
          tocStructure.pdf += 1
          break
        // case NsContent.EMimeTypes.HTML:
        case NsContent.EMimeTypes.TEXT_WEB:
          tocStructure.webPage += 1
          break
        case NsContent.EMimeTypes.QUIZ:
        case NsContent.EMimeTypes.APPLICATION_JSON:
          // if (content.resourceType === 'Assessment') {
          tocStructure.assessment += 1
          // } else {
          //   tocStructure.quiz += 1
          // }
          break
        case NsContent.EMimeTypes.PRACTICE_RESOURCE:
          tocStructure.practiceTest += 1
          break
        // case NsContent.EMimeTypes.WEB_MODULE:
        //   tocStructure.webModule += 1
        //   break
        case NsContent.EMimeTypes.ZIP2:
        case NsContent.EMimeTypes.ZIP:
          tocStructure.interactivecontent += 1
          break
        // case NsContent.EMimeTypes.YOUTUBE:
        //   tocStructure.youtube += 1
        //   break
        default:
          tocStructure.other += 1
          break
      }
      return tocStructure
    }
    return tocStructure
  }

  filterToc(
    content: NsContent.IContent,
    filterCategory: NsContent.EFilterCategory = NsContent.EFilterCategory.ALL,
  ): NsContent.IContent | null {
    if (content.primaryCategory === NsContent.EPrimaryCategory.RESOURCE
      //  || content.contentType === 'Knowledge Artifact'
      || content.primaryCategory === NsContent.EPrimaryCategory.PRACTICE_RESOURCE) {
      return this.filterUnitContent(content, filterCategory) ? content : null
    }
    const filteredChildren: NsContent.IContent[] =
      _.map(_.get(content, 'children'), childContent =>
        this.filterToc(childContent, filterCategory))
        .filter(unitContent => Boolean(unitContent)) as NsContent.IContent[]
    if (filteredChildren && filteredChildren.length) {
      return {
        ...content,
        children: filteredChildren,
      }
    }
    return null
  }

  filterUnitContent(
    content: NsContent.IContent,
    filterCategory: NsContent.EFilterCategory = NsContent.EFilterCategory.ALL,
  ): boolean {
    switch (filterCategory) {
      case NsContent.EFilterCategory.LEARN:
        return (
          !NsContentConstants.VALID_PRACTICE_RESOURCES.has(content.resourceType) &&
          !NsContentConstants.VALID_ASSESSMENT_RESOURCES.has(content.resourceType)
        )
      case NsContent.EFilterCategory.PRACTICE:
        return NsContentConstants.VALID_PRACTICE_RESOURCES.has(content.resourceType)
      case NsContent.EFilterCategory.ASSESS:
        return NsContentConstants.VALID_ASSESSMENT_RESOURCES.has(content.resourceType)
      case NsContent.EFilterCategory.ALL:
      default:
        return true
    }
  }
  fetchContentAnalyticsClientData(contentId: string) {
    if (this.analyticsFetchStatus !== 'fetching' && this.analyticsFetchStatus !== 'done') {
      this.getContentAnalyticsClient(contentId)
    }
  }
  private getContentAnalyticsClient(contentId: string) {
    this.analyticsFetchStatus = 'fetching'
    const url = `${PROXY_SLAG_V8}/LA/api/la/contentanalytics?content_id=${contentId}&type=course`
    this.http.get(url).subscribe(
      (result: any) => {
        this.analyticsFetchStatus = 'done'
        this.analyticsReplaySubject.next(result)
      },
      () => {
        this.analyticsReplaySubject.next(null)
        this.analyticsFetchStatus = 'done'
      },
    )
  }

  fetchContentAnalyticsData(contentId: string) {
    if (this.analyticsFetchStatus !== 'fetching' && this.analyticsFetchStatus !== 'done') {
      this.getContentAnalytics(contentId)
    }
  }
  private getContentAnalytics(contentId: string) {
    this.analyticsFetchStatus = 'fetching'
    // tslint:disable-next-line: max-line-length
    const url = `${PROXY_SLAG_V8}/LA/LA/api/Users?refinementfilter=${encodeURIComponent(
      '"source":["iGot","Learning Hub"]',
    )}$${encodeURIComponent(`"courseCode": ["${contentId}"]`)}`
    this.http.get(url).subscribe(
      (result: any) => {
        this.analyticsFetchStatus = 'done'
        this.analyticsReplaySubject.next(result)
      },
      () => {
        this.analyticsReplaySubject.next(null)
        this.analyticsFetchStatus = 'done'
      },
    )
  }

  clearAnalyticsData() {
    if (this.analyticsReplaySubject) {
      this.analyticsReplaySubject.unsubscribe()
    }
  }

  fetchContentParents(contentId: string): Observable<NsContent.IContentMinimal[]> {
    // return this.http.get<NsContent.IContentMinimal[]>(
    //   `${API_END_POINTS.CONTENT_PARENTS}/${contentId}`,
    // )
    if (contentId) { }
    return EMPTY
  }
  fetchContentWhatsNext(
    contentId: string,
    contentType?: string,
  ): Observable<NsContent.IContentMinimal[]> {
    if (contentType) {
      return this.http.get<NsContent.IContentMinimal[]>(
        `${API_END_POINTS.CONTENT_NEXT}/${contentId}?contentType=${contentType}`,
      )
    }
    return this.http.get<NsContent.IContentMinimal[]>(
      `${API_END_POINTS.CONTENT_NEXT}/${contentId}?ts=${new Date().getTime()}`,
    )
  }

  fetchMoreLikeThisPaid(contentId: string): Observable<NsContent.IContentMinimal[]> {
    return this.http.get<NsContent.IContentMinimal[]>(
      `${API_END_POINTS.CONTENT_NEXT
      }/${contentId}?exclusiveContent=true&ts=${new Date().getTime()}`,
    )
  }

  fetchMoreLikeThisFree(contentId: string): Observable<NsContent.IContentMinimal[]> {
    return this.http.get<NsContent.IContentMinimal[]>(
      `${API_END_POINTS.CONTENT_NEXT
      }/${contentId}?exclusiveContent=false&ts=${new Date().getTime()}`,
    )
  }

  fetchContentCohorts(
    cohortType: NsCohorts.ECohortTypes,
    contentId: string,
  ): Observable<NsCohorts.ICohortsContent[]> {
    return this.http.get<NsCohorts.ICohortsContent[]>(API_END_POINTS.COHORTS(cohortType, contentId), {
      headers: { rootOrg: this.configSvc.rootOrg || '', org: this.configSvc.org ? this.configSvc.org[0] : '' },
    })
  }
  fetchExternalContentAccess(contentId: string): Observable<{ hasAccess: boolean }> {
    return this.http.get<{ hasAccess: boolean }>(API_END_POINTS.EXTERNAL_CONTENT(contentId))
  }
  fetchCohortGroupUsers(groupId: number) {
    return this.http.get<NsCohorts.ICohortsGroupUsers[]>(API_END_POINTS.COHORTS_GROUP_USER(groupId))
  }
  fetchMoreLikeThis(contentId: string, contentType: string): Observable<any> {
    return this.http.get<NsContent.IContent[]>(
      API_END_POINTS.RELATED_RESOURCE(contentId, contentType),
    )
  }

  fetchPostAssessmentStatus(contentId: string) {
    return this.http.get<{ result: NsAppToc.IPostAssessment[] }>(
      API_END_POINTS.POST_ASSESSMENT(contentId),
    )
  }

  fetchContentParent(contentId: string, data: NsAppToc.IContentParentReq, forPreview = false) {
    return this.http.post<NsAppToc.IContentParentResponse>(
      forPreview
        ? API_END_POINTS.CONTENT_AUTH_PARENT(
          contentId,
          this.configSvc.rootOrg || '',
          this.configSvc.org ? this.configSvc.org[0] : '',
        )
        : API_END_POINTS.CONTENT_PARENT(contentId),
      data,
    )
  }

  createBatch(batchData: any) {
    return this.http.post(
      API_END_POINTS.BATCH_CREATE,
      { request: batchData },
    )
  }
}
