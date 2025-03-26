import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { Observable, of, EMPTY, BehaviorSubject } from 'rxjs'
import { catchError, retry, map, shareReplay } from 'rxjs/operators'
import { NsContentStripMultiple } from '../content-strip-multiple/content-strip-multiple.model'
import { NsContent } from './widget-content.model'
import { NSSearch } from './widget-search.model'
// tslint:disable
import _ from 'lodash'
import {  viewerRouteGenerator } from './viewer-route-util'
import moment from 'moment'
// tslint:enable

// TODO: move this in some common place
const PROTECTED_SLAG_V8 = '/apis/protected/v8'

const API_END_POINTS = {
  CONTENT: `${PROTECTED_SLAG_V8}/content`,
  AUTHORING_CONTENT: `/api/course/v1/hierarchy`,
  CONTENT_LIKES: `${PROTECTED_SLAG_V8}/content/likeCount`,
  SET_S3_COOKIE: `${PROTECTED_SLAG_V8}/content/setCookie`,
  SET_S3_IMAGE_COOKIE: `${PROTECTED_SLAG_V8}/content/setImageCookie`,
  FETCH_MANIFEST: `${PROTECTED_SLAG_V8}/content/getWebModuleManifest`,
  FETCH_WEB_MODULE_FILES: `${PROTECTED_SLAG_V8}/content/getWebModuleFiles`,
  MULTIPLE_CONTENT: `${PROTECTED_SLAG_V8}/content/multiple`,
  CONTENT_SEARCH_V5: `${PROTECTED_SLAG_V8}/content/searchV5`,
  CONTENT_SEARCH_V6: `/apis/proxies/v8/sunbirdigot/search`,
  TRENDING_CONTENT_SEARCH: `apis/proxies/v8/trending/content/search`,
  CONTENT_SEARCH_RELATED_CBP_V6: `/apis/proxies/v8/sunbirdigot/search`,
  CONTENT_SEARCH_REGION_RECOMMENDATION: `${PROTECTED_SLAG_V8}/content/searchRegionRecommendation`,
  CONTENT_HISTORY: `${PROTECTED_SLAG_V8}/user/history`,
  CONTENT_HISTORYV2: `/apis/proxies/v8/read/content-progres`,
  COURSE_BATCH_LIST: `/apis/proxies/v8/learner/course/v1/batch/list`,
  COURSE_BATCH: `/apis/proxies/v8/course/v1/batch/read`,
  AUTO_ASSIGN_BATCH: `/apis/protected/v8/cohorts/user/autoenrollment/`,
  AUTO_ASSIGN_CURATED_BATCH: `/apis/proxies/v8/curatedprogram/v1/enrol`,
  AUTO_ASSIGN_OPEN_PROGRAM: `/apis/proxies/v8/openprogram/v1/enrol`,
  USER_CONTINUE_LEARNING: `${PROTECTED_SLAG_V8}/user/history/continue`,
  CONTENT_RATING: `${PROTECTED_SLAG_V8}/user/rating`,
  COLLECTION_HIERARCHY: (type: string, id: string) =>
    `${PROTECTED_SLAG_V8}/content/collection/${type}/${id}`,
  REGISTRATION_STATUS: `${PROTECTED_SLAG_V8}/admin/userRegistration/checkUserRegistrationContent`,
  MARK_AS_COMPLETE_META: (contentId: string) => `${PROTECTED_SLAG_V8}/user/progress/${contentId}`,
  ENROLL_BATCH: `/apis/proxies/v8/learner/course/v1/enrol`,
  ENROLL_BATCH_WF: `/apis/proxies/v8/workflow/blendedprogram/enrol`,
  WITHDRAW_BATCH_WF: `/apis/proxies/v8/workflow/blendedprogram/unenrol`,
  BLENDED_USER_WF: `/apis/proxies/v8/workflow/blendedprogram/user/search`,
  BLENDED_USER_COUNT: `apis/proxies/v8/workflow/blendedprogram/enrol/status/count`,
  CERT_ADD_TEMPLATE: `${PROTECTED_SLAG_V8}/cohorts/course/batch/cert/template/add`,
  CERT_ISSUE: `${PROTECTED_SLAG_V8}/cohorts/course/batch/cert/issue`,
  CERT_DOWNLOAD: (certId: any) => `${PROTECTED_SLAG_V8}/cohorts/course/batch/cert/download/${certId}`,
  READ_KARMAPOINTS: `/apis/proxies/v8/karmapoints/read`,
  CONTENT_READ: (contentId: any) => `/apis/proxies/v8/action/content/v3/read/${contentId}`,
  READ_COURSE_KARMAPOINTS: '/apis/proxies/v8/karmapoints/user/course/read',
  CLAIM_KARMAPOINTS: '/apis/proxies/v8/claimkarmapoints',
  USER_KARMA_POINTS: '/apis/proxies/v8/user/totalkarmapoints',
  EXT_CONTENT_READ: (contentId: any) => `/apis/proxies/v8/cios/v1/content/read/${contentId}`,
  EXT_USER_COURSE_ENROLL : (contentId: any) => `/apis/proxies/v8/cios-enroll/v1/readby/useridcourseid/${contentId}`,
  EXT_CONTENT_EROLL: `/apis/proxies/v8/cios-enroll/v1/create`,
}

@Injectable({
  providedIn: 'root',
})
export class WidgetContentService {
  constructor(
    private http: HttpClient,
    private configSvc: ConfigurationsService,
  ) {
  }

  tocConfigData: any = new BehaviorSubject<any>({})
  tocConfigData$  = this.tocConfigData.asObservable()
  currentMetaData!: NsContent.IContent
  currentContentReadMetaData!: NsContent.IContent
  currentBatchEnrollmentList!: NsContent.ICourse[]
  programChildCourseResumeData = new BehaviorSubject<any>({})
  programChildCourseResumeData$ = this.programChildCourseResumeData.asObservable()
  isResource(primaryCategory: string) {
    if (primaryCategory) {
      const isResource = (primaryCategory === NsContent.EResourcePrimaryCategories.LEARNING_RESOURCE) ||
        (primaryCategory === NsContent.EResourcePrimaryCategories.PRACTICE_RESOURCE) ||
        (primaryCategory === NsContent.EResourcePrimaryCategories.FINAL_ASSESSMENT) ||
        (primaryCategory === NsContent.EResourcePrimaryCategories.COMP_ASSESSMENT) ||
        (primaryCategory === NsContent.EResourcePrimaryCategories.OFFLINE_SESSION)
      return isResource
    }
    return false
  }

  fetchMarkAsCompleteMeta(identifier: string): Promise<any> {
    // tslint:disable-next-line
    const url = API_END_POINTS.MARK_AS_COMPLETE_META(identifier)
    // return this.http.get(url).toPromise()
    if (url) { }
    return of().toPromise()
  }

  updateTocConfig(data: any) {
    this.tocConfigData.next(data)
  }

  fetchContent(
    contentId: string,
    hierarchyType: 'all' | 'minimal' | 'detail' = 'detail',
    _additionalFields: string[] = [],
    primaryCategory?: string | null,
  ): Observable<NsContent.IContent> {
    // const url = `${API_END_POINTS.CONTENT}/${contentId}?hierarchyType=${hierarchyType}`
    let url = ''
    const forPreview = window.location.href.includes('/public/') || window.location.href.includes('&preview=true')
    if (primaryCategory && this.isResource(primaryCategory)) {
      if (!forPreview) {
        url = `/apis/proxies/v8/action/content/v3/read/${contentId}`
      } else {
        if (window.location.href.includes('editMode=true') && window.location.href.includes('_rc')) {
          url = `/apis/proxies/v8/action/content/v3/read/${contentId}`
        } else {
            url = `/api/content/v1/read/${contentId}`
        }
      }
    } else {
      if (!forPreview) {
        url = `/apis/proxies/v8/action/content/v3/hierarchy/${contentId}?hierarchyType=${hierarchyType}`
      } else {
        const forcreator = window.location.href.includes('editMode=true')
        if (forcreator) {
          url = `apis/proxies/v8/action/content/v3/hierarchy/${contentId}?mode=edit`
        } else {
          url = `/api/course/v1/hierarchy/${contentId}?hierarchyType=${hierarchyType}`
        }
      }
    }
    // return this.http
    //   .post<NsContent.IContent>(url, { additionalFields })
    //   .pipe(retry(1))
    return this.http
      .get<NsContent.IContent>(url)
      .pipe(shareReplay(1))
    // if (apiData && apiData.result) {
    //   return apiData.result.content
    // }
  }
  fetchAuthoringContent(contentId: string): Observable<NsContent.IContent> {
    const forcreator = window.location.href.includes('editMode=true')
    let url = ''
    if (forcreator) {
      url = `apis/proxies/v8/action/content/v3/hierarchy/${contentId}?mode=edit`
    } else {
      url = `${API_END_POINTS.AUTHORING_CONTENT}/${contentId}?hierarchyType=detail`
    }
    return this.http.get<NsContent.IContent>(url).pipe(shareReplay(1), r => r)
  }
  fetchMultipleContent(ids: string[]): Observable<NsContent.IContent[]> {
    return this.http.get<NsContent.IContent[]>(
      `${API_END_POINTS.MULTIPLE_CONTENT}/${ids.join(',')}`,
    )
  }
  fetchCollectionHierarchy(type: string, id: string, pageNumber: number = 0, pageSize: number = 1) {
    return this.http.get<NsContent.ICollectionHierarchyResponse>(
      `${API_END_POINTS.COLLECTION_HIERARCHY(
        type,
        id,
      )}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
    )
  }

  fetchBlendedCourse() {

  }

  fetchCourseBatches(req: any): Observable<NsContent.IBatchListResponse> {
    return this.http
      .post<NsContent.IBatchListResponse>(API_END_POINTS.COURSE_BATCH_LIST, req)
      .pipe(
        retry(1),
        map(
          (data: any) => data.result.response
        )
      )
  }

  // fetch individual batch
  fetchCourseBatch(batchId: string): Observable<NsContent.IContinueLearningData> {
    return this.http.get<NsContent.IContinueLearningData>(
      `${API_END_POINTS.COURSE_BATCH}/${batchId}`,
    )
  }

  autoAssignBatchApi(identifier: any): Observable<NsContent.IBatchListResponse> {
    return this.http.get<NsContent.IBatchListResponse>(`${API_END_POINTS.AUTO_ASSIGN_BATCH}${identifier}`)
      .pipe(
        retry(1),
        map(
          (data: any) => data.result.response
        )
      )
  }

  autoAssignCuratedBatchApi(request: any, programType: any): Observable<NsContent.IBatchListResponse> {
    const url = programType === NsContent.ECourseCategory.MODERATED_PROGRAM ?
    API_END_POINTS.AUTO_ASSIGN_OPEN_PROGRAM : API_END_POINTS.AUTO_ASSIGN_CURATED_BATCH
    return this.http.post<NsContent.IBatchListResponse>(`${url}`, request)
      .pipe(
        retry(1),
        map(
          (data: any) => data.result.response
        )
      )
  }

  enrollUserToBatch(req: any) {
    return this.http
      .post(API_END_POINTS.ENROLL_BATCH, req)
      .toPromise()
  }

  enrollAndUnenrollUserToBatchWF(req: any, type: any) {
    const url: any = type === 'WITHDRAW' ? API_END_POINTS.WITHDRAW_BATCH_WF : API_END_POINTS.ENROLL_BATCH_WF
    return this.http
      .post(url, req)
      .toPromise()
  }

  fetchBlendedUserWF(req: any) {
    return this.http
      .post(API_END_POINTS.BLENDED_USER_WF, req)
      .toPromise()
  }

  fetchBlendedUserCOUNT(req: any) {
    return this.http
      .post(API_END_POINTS.BLENDED_USER_COUNT, req)
      .toPromise()
  }

  fetchContentLikes(contentIds: { content_id: string[] }) {
    return this.http
      .post<{ [identifier: string]: number }>(API_END_POINTS.CONTENT_LIKES, contentIds)
      .toPromise()
  }
  fetchContentRatings(contentIds: { contentIds: string[] }) {
    if (contentIds) { }
    // return this.http
    //   .post(`${API_END_POINTS.CONTENT_RATING}/rating`, contentIds)
    //   .toPromise()
    return of().toPromise()
  }

  fetchContentHistory(contentId: string): Observable<NsContent.IContinueLearningData> {
    return this.http.get<NsContent.IContinueLearningData>(
      `${API_END_POINTS.CONTENT_HISTORY}/${contentId}`,
    )
  }

  fetchContentHistoryV2(req: NsContent.IContinueLearningDataReq): Observable<NsContent.IContinueLearningData> {
    req.request.fields = ['progressdetails']
    const data = this.http.post<NsContent.IContinueLearningData>(
      `${API_END_POINTS.CONTENT_HISTORYV2}/${req.request.courseId}`, req
    )
    data.subscribe((subscribeData: any) => {
          this.programChildCourseResumeData.next({ resumeData: subscribeData.result.contentList, courseId: req.request.courseId })
        })
    return data
  }

  async continueLearning(id: string, collectionId?: string, collectionType?: string): Promise<any> {
    return new Promise(async resolve => {
      if (collectionType &&
        collectionType.toLowerCase() === 'playlist') {
        const reqBody = {
          contextPathId: collectionId ? collectionId : id,
          resourceId: id,
          data: JSON.stringify({
            timestamp: Date.now(),
            contextFullPath: [collectionId, id],
          }),
          dateAccessed: Date.now(),
          contextType: 'playlist',
        }
        await this.saveContinueLearning(reqBody).toPromise().catch().finally(() => {
          resolve(true)
        }
        )
      } else {
        const reqBody = {
          contextPathId: collectionId ? collectionId : id,
          resourceId: id,
          data: JSON.stringify({ timestamp: Date.now() }),
          dateAccessed: Date.now(),
        }
        await this.saveContinueLearning(reqBody).toPromise().catch().finally(() => {
          resolve(true)
        })
      }
    })
  }
  saveContinueLearning(content: NsContent.IViewerContinueLearningRequest): Observable<any> {
    // const url = API_END_POINTS.USER_CONTINUE_LEARNING
    // return this.http.post<any>(url, content)
    if (content) {

    }
    return of() as any
  }

  setS3Cookie(
    _contentId: string,
    // _path: string,
  ): Observable<any> {
    // return this.http
    //   .post(API_END_POINTS.SET_S3_COOKIE, { contentId })
    //   .pipe(catchError(_err => of(true)))

    return EMPTY
  }

  setS3ImageCookie(): Observable<any> {
    return this.http.post(API_END_POINTS.SET_S3_IMAGE_COOKIE, {}).pipe(catchError(_err => of(true)))
  }

  fetchManifest(url: string): Observable<any> {
    return this.http.post(API_END_POINTS.FETCH_MANIFEST, { url })
  }
  fetchWebModuleContent(url: string): Observable<any> {
    return this.http.get(`${API_END_POINTS.FETCH_WEB_MODULE_FILES}?url=${encodeURIComponent(url)}`)
  }
  search(req: NSSearch.ISearchRequest): Observable<NSSearch.ISearchApiResult> {
    req.query = req.query || ''
    return this.http.post<NSSearch.ISearchApiResult>(API_END_POINTS.CONTENT_SEARCH_V5, {
      request: req,
    })
  }
  searchRegionRecommendation(
    req: NSSearch.ISearchOrgRegionRecommendationRequest,
  ): Observable<NsContentStripMultiple.IContentStripResponseApi> {
    req.query = req.query || ''
    req.preLabelValue =
      (req.preLabelValue || '') +
      ((this.configSvc.userProfile && this.configSvc.userProfile.country) || '')
    req.filters = {
      ...req.filters,
      labels: [req.preLabelValue || ''],
    }
    return this.http.post<NsContentStripMultiple.IContentStripResponseApi>(
      API_END_POINTS.CONTENT_SEARCH_REGION_RECOMMENDATION,
      { request: req },
    )
  }
  searchV6(req: NSSearch.ISearchV6Request): Observable<NSSearch.ISearchV6ApiResultV2> {
    const apiPath = _.get(req, 'api.path')
    req.query = req.query || ''
    if (apiPath) {
      return this.http.get<NSSearch.ISearchV6ApiResultV2>(apiPath)
    }
    return this.http.post<NSSearch.ISearchV6ApiResultV2>(API_END_POINTS.CONTENT_SEARCH_V6, req)
  }

  searchRelatedCBPV6(req: NSSearch.ISearchV6RequestV2): Observable<NSSearch.ISearchV6ApiResultV2> {
    return this.http.post<NSSearch.ISearchV6ApiResultV2>(API_END_POINTS.CONTENT_SEARCH_RELATED_CBP_V6, req)
  }

  fetchContentRating(contentId: string): Observable<{ rating: number }> {
    return this.http.get<{ rating: number }>(`${API_END_POINTS.CONTENT_RATING}/${contentId}`)
  }
  deleteContentRating(contentId: string): Observable<any> {
    return this.http.delete(`${API_END_POINTS.CONTENT_RATING}/${contentId}`)
  }
  addContentRating(contentId: string, data: { rating: number }): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.CONTENT_RATING}/${contentId}`, data)
  }

  getFirstChildInHierarchy(content: NsContent.IContent): NsContent.IContent {
    if (!(content.children || []).length) {
      return content
    }
    if (
      (content.primaryCategory === NsContent.EPrimaryCategory.PROGRAM &&
        !(content.artifactUrl && content.artifactUrl.length)) ||
      content.primaryCategory === NsContent.EPrimaryCategory.MANDATORY_COURSE_GOAL ||
      (content.primaryCategory === NsContent.EPrimaryCategory.BLENDED_PROGRAM &&
        !(content.artifactUrl && content.artifactUrl.length)) ||
      (content.primaryCategory === NsContent.EPrimaryCategory.MODULE &&
        !(content.artifactUrl && content.artifactUrl.length))
    ) {
      const child = content.children[0]
      return this.getFirstChildInHierarchy(child)
    }
    if (
      content.primaryCategory === NsContent.EPrimaryCategory.RESOURCE ||
      content.primaryCategory === NsContent.EPrimaryCategory.KNOWLEDGE_ARTIFACT ||
      content.primaryCategory === NsContent.EPrimaryCategory.PROGRAM ||
      content.primaryCategory === NsContent.EPrimaryCategory.PRACTICE_RESOURCE ||
      content.primaryCategory === NsContent.EPrimaryCategory.FINAL_ASSESSMENT ||
      content.primaryCategory === NsContent.EPrimaryCategory.COMP_ASSESSMENT ||
      content.primaryCategory === NsContent.EPrimaryCategory.BLENDED_PROGRAM ||
      content.primaryCategory === NsContent.EPrimaryCategory.OFFLINE_SESSION
    ) {
      return content
    }
    const firstChild = content.children[0]
    const resultContent = this.getFirstChildInHierarchy(firstChild)
    return resultContent
  }

  getRegistrationStatus(source: string): Promise<{ hasAccess: boolean; registrationUrl?: string }> {
    return this.http.get<any>(`${API_END_POINTS.REGISTRATION_STATUS}/${source}`).toPromise()
  }

  fetchConfig(url: string) {
    return this.http.get<any>(url)
  }

  addCertTemplate(body: any) {
    return this.http.patch<any>(`${API_END_POINTS.CERT_ADD_TEMPLATE}`, body)
  }

  issueCert(body: any) {
    return this.http.post<any>(`${API_END_POINTS.CERT_ISSUE}`, body)
  }
  downloadCert(certId: any) {
    return this.http.get<any>(`${API_END_POINTS.CERT_DOWNLOAD(certId)}`)
  }

  trendingContentSearch(req: any): Observable<NsContent.IContent> {
    req.query = req.query || ''
    return this.http.post<NsContent.IContent>(API_END_POINTS.TRENDING_CONTENT_SEARCH, req)
  }

  getKarmaPoitns (limit: number, offset: any) {
    return this.http.post(API_END_POINTS.READ_KARMAPOINTS, { limit, offset }).pipe(catchError(_err => of(true)))
  }
  fetchProgramContent(contentId: string[]): Observable<NsContent.IContent[]> {
    let url = ''
    const forPreview = window.location.href.includes('/public/') || window.location.href.includes('&preview=true')
    if (!forPreview) {
      return this.http.get<NsContent.IContent[]>(
        API_END_POINTS.CONTENT_READ(contentId),
      )
    }
    if (window.location.href.includes('editMode=true')) {
      url = `/apis/proxies/v8/action/content/v3/read/${contentId}`
    } else {
        url = `/api/content/v1/read/${contentId}`
    }
    return this.http.get<NsContent.IContent[]>(url)
    // return this.http.get<NsContent.IContent[]>(API_END_POINTS.CONTENT_READ(contentId))
  }
  fetchExternalContent(contentId: string[]): Observable<NsContent.IContent[]> {
    return this.http.get<NsContent.IContent[]>(API_END_POINTS.EXT_CONTENT_READ(contentId))
  }

  fetchExtUserContentEnroll(contentId: string) {
    return this.http.get<any>(API_END_POINTS.EXT_USER_COURSE_ENROLL(contentId))
  }

  extContentEnroll (requestBody: any) {
    return this.http.post<any>(`${API_END_POINTS.EXT_CONTENT_EROLL}`, requestBody)
  }

  getCourseKarmaPoints(request: any) {
    return this.http.post<any>(API_END_POINTS.READ_COURSE_KARMAPOINTS, request)
  }

  claimKarmapoints(request: any) {
    return this.http.post<any>(API_END_POINTS.CLAIM_KARMAPOINTS, request)
  }

  userKarmaPoints() {
    return this.http.post<any>(API_END_POINTS.USER_KARMA_POINTS, {})
  }

  getEnrolledData(doId: string) {
    const enrollmentMapData = JSON.parse(localStorage.getItem('enrollmentMapData') || '{}')
    const enrolledCourseData = enrollmentMapData[doId]
    return enrolledCourseData
  }

  async getResourseLink(content: any) {
    const enrolledCourseData: any = this.getEnrolledData(content.identifier)
    if (enrolledCourseData) {
      if (enrolledCourseData && enrolledCourseData.content && enrolledCourseData.content.status &&
        enrolledCourseData.content.status.toLowerCase() !== 'retired') {
        if (enrolledCourseData.content.courseCategory ===  NsContent.ECourseCategory.BLENDED_PROGRAM ||
          enrolledCourseData.content.courseCategory ===  NsContent.ECourseCategory.INVITE_ONLY_PROGRAM ||
          enrolledCourseData.content.courseCategory ===  NsContent.ECourseCategory.MODERATED_PROGRAM ||
          enrolledCourseData.content.primaryCategory ===  NsContent.EPrimaryCategory.BLENDED_PROGRAM ||
          enrolledCourseData.content.primaryCategory ===  NsContent.EPrimaryCategory.PROGRAM) {
            if (!this.isBatchInProgress(enrolledCourseData.batch)) {
              return this.gotoTocPage(content)
            }
            const returnData =  await this.checkForDataToFormUrl(content, enrolledCourseData)
            return returnData
        }
        const data =  await this.checkForDataToFormUrl(content, enrolledCourseData)
        return data
      }
      return ''
    }
    return this.gotoTocPage(content)
  }
  async checkForDataToFormUrl(content: any, enrollData: any) {
    let urlData: any
    if (enrollData.completionPercentage  === 100) {
      return this.gotoTocPage(enrollData)
    }
    // if (enrollData.lrcProgressDetails && enrollData.lrcProgressDetails.mimeType) {
    //   const modifyEnrollData  = {
    //     ...enrollData,
    //     identifier: enrollData.collectionId,
    //     primaryCategory: enrollData.content.primaryCategory,
    //     name: enrollData.content.name,
    //   }
    //   if (modifyEnrollData.lastReadContentId) {
    //     return this.getResourseDataWithData(modifyEnrollData,
    //                                         enrollData.lastReadContentId, enrollData.lrcProgressDetails.mimeType)
    //   }
    //   if (modifyEnrollData.firstChildId) {
    //     return this.getResourseDataWithData(modifyEnrollData,
    //                                         enrollData.firstChildId,
    //                                         enrollData.lrcProgressDetails.mimeType)
    //   }
    // }
      if (enrollData.lastReadContentId || enrollData.firstChildId) {
        const doId =  enrollData.lastReadContentId || enrollData.firstChildId
        const responseData = await this.fetchProgramContent(doId).toPromise().then(async (res: any) => {
          if (res && res.result && res.result.content) {
            const contentData: any = res.result.content
            const modifyEnrollData  = {
              ...enrollData,
              identifier: enrollData.collectionId,
              primaryCategory: enrollData.content.primaryCategory,
              name: enrollData.content.name,
            }
            urlData =  this.getResourseDataWithData(modifyEnrollData, contentData.identifier, contentData.mimeType)
            if (urlData) {
              return urlData
            }
          }
        })
        return responseData ? responseData : this.gotoTocPage(content)
      }
        return this.gotoTocPage(content)

  }

  getResourseDataWithData(content: any, resourseId: any, mimeType: any) {
    if (content) {
      const url = viewerRouteGenerator(
        resourseId,
        mimeType,
        content.identifier,
        'Course',
        false,
        'Learning Resource',
        content.batchId,
        content.name,
      )
      return url
    }
    return this.gotoTocPage(content)
  }
  gotoTocPage(content: any) {
    const urlData: any = {
      url: `/app/toc/${content.identifier ? content.identifier : content.collectionId}/overview`,
      queryParams: { batchId: content.batchId },
    }
    if (content.endDate) {
      urlData.queryParams = { ...urlData.queryParams, planType: 'cbPlan', endDate: content.endDate }
    }
    if (content.contentId && content.contentId.includes('ext_')) {
      urlData.url = `/app/toc/ext/${content.contentId}`
      urlData.queryParams = {}
    }
    return urlData
  }
  isBatchInProgress(batchData: any) {
    // if (this.content && this.content['batches']) {
    // const batches = this.content['batches'] as NsContent.IBatch
    if (batchData && batchData.endDate) {
      const now = moment().format('YYYY-MM-DD')
      const startDate = moment(batchData.startDate).format('YYYY-MM-DD')
      const endDate = batchData.endDate ? moment(batchData.endDate).format('YYYY-MM-DD') : now
          return (
            // batch.status &&
            moment(startDate).isSameOrBefore(now)
            && moment(endDate).isSameOrAfter(now)
          )
    } return true
  }
}
