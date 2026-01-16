import { ConfigurationsService, DomainConfService } from '@sunbird-cb/utils-v2'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { noop, Observable, Subject } from 'rxjs'
import dayjs from 'dayjs'
import { NsContent } from '@sunbird-cb/collection/src/lib/_services/widget-content.model'
import { environment } from 'src/environments/environment'
import { WidgetContentService } from '@sunbird-cb/collection/src/lib/_services/widget-content.service'
import { AppTocService } from '@ws/app/src/lib/routes/app-toc/services/app-toc.service'
import { ContentLanguageService, WidgetUserServiceLib } from '@sunbird-cb/consumption'

@Injectable({
  providedIn: 'root',
})
export class ViewerUtilService {
  API_ENDPOINTS = {
    setS3Cookie: `/apis/v8/protected/content/setCookie`,
    // PROGRESS_UPDATE: `/apis/protected/v8/user/realTimeProgress/update`,
    PROGRESS_UPDATE: `/apis/proxies/v8/content-progres`,
    ASSESSMENT_SECTION: `/apis/proxies/v8/assessment/v5/read`,
    GET_FORM_BYID: (formId: string) => `apis/proxies/v8/forms/v2/getFormById?formId=${formId}`,
    SUBMIT_FORM: `/apis/proxies/v8/forms/v2/saveFormSubmit`,
    // GET_FORM_BYID: (formId: string) => `apis/proxies/v8/forms/getFormById?id=${formId}`,
    // SUBMIT_FORM: `/apis/proxies/v8/forms/v1/saveFormSubmit`,
    PRE_ASSESSMENT_STATE_UPDATE: `/apis/proxies/v8/content/v2/state/update`

  }
  downloadRegex = new RegExp(`(/content-store/.*?)(\\\)?\\\\?['"])`, 'gm')
  authoringBase = '/apis/authContent/'
  markAsCompleteSubject = new Subject()
  autoPlayNextVideo = new Subject()
  autoPlayNextAudio = new Subject()
  forPreview = window.location.href.includes('/public/') || window.location.href.includes('&preview=true')
  publicUserDetails: any = {}
  constructor(
    private http: HttpClient,
    private configservice: ConfigurationsService,
    private contentSvc: WidgetContentService,
    private tocSvc: AppTocService,
    private userSvc: WidgetUserServiceLib,
    private contentLangSvc: ContentLanguageService,
    private domainConfSvc: DomainConfService
  ) { }

  async fetchManifestFile(url: string) {
    this.setS3Cookie(url)
    const manifestFile = await this.http
      .get<any>(url)
      .toPromise()
      .catch((_err: any) => { })
    return manifestFile
  }

  private async setS3Cookie(_contentId: string) {
    // await this.http
    //   .post(this.API_ENDPOINTS.setS3Cookie, { contentId })
    //   .toPromise()
    //   .catch((_err: any) => { })
    return
  }

  calculatePercent(current: string[], max: number, mimeType?: string): number {
    try {
      const temp = [...current]
      if (temp && temp.length && max) {
        const latest = parseFloat(temp.pop() || '0')
        const percentMilis = (latest / max) * 100
        let percent = parseFloat(percentMilis.toFixed(2))
        if (
          mimeType === NsContent.EMimeTypes.MP4 ||
          mimeType === NsContent.EMimeTypes.M3U8 ||
          mimeType === NsContent.EMimeTypes.MP3 ||
          mimeType === NsContent.EMimeTypes.M4A ||
          mimeType === NsContent.EMimeTypes.YOUTUBE ||
          mimeType === NsContent.EMimeTypes.SURVEY
        ) {
          if (percent <= 5) {
            // if percentage is less than 5% make it 0
            percent = 0
          } else if (percent >= 95) {
            // if percentage is greater than 95% make it 100
            percent = 100
          }
        }
        return percent
      }
      return 0
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.log('Error in calculating percentage', e)
      return 0
    }
  }

  getStatus(current: string[], max: number, mimeType?: string) {
    try {
      const percentage = this.calculatePercent(current, max, mimeType)
      // for videos and audios
      if (
        mimeType === NsContent.EMimeTypes.MP4 ||
        mimeType === NsContent.EMimeTypes.M3U8 ||
        mimeType === NsContent.EMimeTypes.MP3 ||
        mimeType === NsContent.EMimeTypes.M4A ||
        mimeType === NsContent.EMimeTypes.SURVEY ||
        mimeType === NsContent.EMimeTypes.PDF
      ) {
        // if percentage is less than 5% then make status started
        if (Math.ceil(percentage) <= 5) {
          return 1
        }
        // if percentage is greater than 95% then make status complete
        if (Math.ceil(percentage) >= 95) {
          return 2
        }
      } else {
        if (Math.ceil(percentage) >= 100) {
          return 2
        }
      }
      return 1
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.log('Error in getting completion status', e)
      return 1
    }
  }

  realTimeProgressUpdate(contentId: string, request: any, collectionId?: string, batchId?: string) {
    let req: any
    if (this.configservice.userProfile) {
      const language = this.getResourceContentLanguage(contentId)
      req = {
        request: {
          userId: this.configservice.userProfile.userId || '',
          contents: [
            {
              contentId,
              batchId,
              language,
              status: this.getStatus(request.current, request.max_size, request.mime_type),
              courseId: collectionId,
              lastAccessTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss:SSSZZ'),
              progressdetails: {
                max_size: request.max_size,
                current: request.current,
                mimeType: request.mime_type,
              },
              completionPercentage: this.calculatePercent(request.current, request.max_size, request.mime_type),
            },
          ],
        },
      }
      // if (this.configservice.cstoken !== '') {
      //   const headers = new HttpHeaders()
      //   .set('cstoken', this.configservice.cstoken)

      //   this.http
      //   .patch(`${this.API_ENDPOINTS.PROGRESS_UPDATE}/${contentId}`, { headers } , req)
      //   .subscribe(noop, noop)
      // } else {
      //   this.http
      //   .patch(`${this.API_ENDPOINTS.PROGRESS_UPDATE}/${contentId}`, req)
      //   .subscribe(noop, noop)
      // }
      this.http
        .patch(`${this.API_ENDPOINTS.PROGRESS_UPDATE}/${contentId}`, req)
        .subscribe(noop, noop)
      if (this.tocSvc.hashmap[contentId] &&
        (!this.tocSvc.hashmap[contentId]['completionStatus'] || this.tocSvc.hashmap[contentId]['completionStatus'] < 2)) {
        this.tocSvc.hashmap[contentId]['completionPercentage'] = req.request.contents[0].completionPercentage
        this.tocSvc.hashmap[contentId]['completionStatus'] = req.request.contents[0].status
        this.tocSvc.hashmap = { ...this.tocSvc.hashmap }
      }
    } else {
      req = {}
      // do nothing
    }
  }

  getBatchIdAndCourseId(courseId: string, batchId: string, resourceId: string) {
    const tempData = {
      courseId,
      batchId,
    }
    const tempContentData = this.contentSvc.currentMetaData
    const tempContentReadData = this.contentSvc.currentContentReadMetaData
    const enrollmentList = this.contentSvc.currentBatchEnrollmentList
    if (!this.forPreview) {
      if (tempContentData && tempContentReadData.cumulativeTracking &&
        (tempContentData.primaryCategory === NsContent.EPrimaryCategory.PROGRAM ||
          tempContentData.primaryCategory === NsContent.EPrimaryCategory.CURATED_PROGRAM
          || tempContentData.primaryCategory === NsContent.EPrimaryCategory.BLENDED_PROGRAM
        )
      ) {
        tempContentData.children.forEach(async (childList: NsContent.IContent) => {
          if (childList.primaryCategory === NsContent.EPrimaryCategory.COURSE) {
            // tslint:disable-next-line: max-line-length
            const courseEnrollmentList = enrollmentList && enrollmentList.filter((v: NsContent.ICourse) => v.contentId === childList.identifier)
            if (childList.childNodes && childList.childNodes.indexOf(resourceId) !== -1) {
              if (courseEnrollmentList && courseEnrollmentList.length > 0) {
                tempData.batchId = courseEnrollmentList[courseEnrollmentList.length - 1].batch.batchId
                tempData.courseId = childList.identifier
              } else {
                const data: any = await this.checkForCourseEnrollment(childList, resourceId, enrollmentList, tempData)
                tempData.courseId = data.courseId
                tempData.batchId = data.batchId
              }
            }
          } else if (tempContentData.primaryCategory === NsContent.EPrimaryCategory.BLENDED_PROGRAM) {
            if (tempData.courseId === courseId) {
              const bPEnrollmentList = enrollmentList.filter((v: NsContent.ICourse) => v.contentId === tempContentData.identifier)
              if (tempContentData.childNodes && tempContentData.childNodes.indexOf(resourceId) !== -1) {
                if (bPEnrollmentList.length > 0) {
                  tempData.batchId = bPEnrollmentList[bPEnrollmentList.length - 1].batch.batchId
                  tempData.courseId = tempContentData.identifier
                }
              }
            }
          }
        })
      }
    }
    return tempData
  }

  getResourceContentLanguage(resourceId: string) {

    let tempLanguage: any = 'english'
    let languageFound = false
    const tempContentData = this.contentSvc.currentMetaData
    if (!this.forPreview) {
      tempContentData.children?.forEach(async (childList: NsContent.IContent) => {
        if (childList.primaryCategory === NsContent.EPrimaryCategory.COURSE) {
          // tslint:disable-next-line: max-line-length
          if (childList.leafNodes && childList.leafNodes.indexOf(resourceId) !== -1) {
            tempLanguage = this.contentLangSvc.getContentLanguage(childList)
            languageFound = true
          }
        }
      }
      )
      if (!languageFound) {
        if (tempContentData.leafNodes && tempContentData.leafNodes.indexOf(resourceId) !== -1) {
          tempLanguage = this.contentLangSvc.getContentLanguage(tempContentData)
        }
      }
    }
    return tempLanguage
  }

  async checkForCourseEnrollment(childList: NsContent.IContent, _resourceId: string, _enrollmentList: any, _tempData: any) {
    // tslint:disable-next-line: max-line-length
    const courseData: any = await this.contentSvc.autoAssignBatchApi(childList.identifier).toPromise().then(async (data: NsContent.IBatchListResponse) => {
      if (data) {
        // tslint:disable-next-line: max-line-length
        const responseData = await this.userSvc.fetchEnrollmentDataByContentId(this.configservice.userProfile?.userId, childList.identifier).toPromise().then(async (res: any) => {
          if (res && res.courses && res.courses.length) {
            return res.courses
          }
          return [{ courseId: childList.identifier, batchId: '' }]

        }).catch((_err: any) => {
          return [{ courseId: childList.identifier, batchId: '' }]
        })
        this.contentSvc.currentBatchEnrollmentList = [...this.contentSvc.currentBatchEnrollmentList, ...responseData]
        return { courseId: childList.identifier, batchId: responseData[0].batchId }
      }
    }).catch((_err: any) => {
      return [{ courseId: childList.identifier, batchId: '' }]
    })
    return courseData
  }

  realTimeProgressUpdateQuiz(contentId: string, collectionId?: string, batchId?: string, status?: number) {
    let req: any
    if (this.configservice.userProfile) {
      const language = this.getResourceContentLanguage(contentId)
      req = {
        request: {
          userId: this.configservice.userProfile.userId || '',
          contents: [
            {
              contentId,
              batchId,
              language,
              status: status || 2,
              courseId: collectionId,
              lastAccessTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss:SSSZZ'),
              completionPercentage: status === 2 ? 100 : 0,
            },
          ],
        },
      }

      this.http
        .patch(`${this.API_ENDPOINTS.PROGRESS_UPDATE}/${contentId}`, req)
        .subscribe(noop, noop)
      if (this.tocSvc.hashmap && this.tocSvc.hashmap[contentId] && req.request.contents[0]) {
        if (this.tocSvc.hashmap[contentId] &&
          (!this.tocSvc.hashmap[contentId]['completionStatus'] || this.tocSvc.hashmap[contentId]['completionStatus'] < 2)) {
          this.tocSvc.hashmap[contentId]['completionPercentage'] = req.request.contents[0].completionPercentage
          this.tocSvc.hashmap[contentId]['completionStatus'] = req.request.contents[0].status
          this.tocSvc.hashmap = { ...this.tocSvc.hashmap }
        }
      }
    } else {
      req = {}
      // do nothing
    }
  }

  getContent(contentId: string): Observable<NsContent.IContent> {
    const forPreview = window.location.href.includes('/public/') || window.location.href.includes('&preview=true')
    let url = `/apis/proxies/v8/action/content/v3/read/${contentId}`
    if (!forPreview) {
      url = `/apis/proxies/v8/action/content/v3/read/${contentId}`
    } else {
      if (window.location.href.includes('editMode=true') && window.location.href.includes('_rc')) {
        url = `/apis/proxies/v8/action/content/v3/read/${contentId}`
      } else {
        url = `/api/content/v1/read/${contentId}`
      }
    }
    return this.http.get<NsContent.IContent>(
      // tslint:disable-next-line:max-line-length
      // `/apis/authApi/action/content/hierarchy/${contentId}?rootOrg=${this.configservice.rootOrg || 'igot'}&org=${this.configservice.activeOrg || 'dopt'}`,
      url
    )
  }

  getAuthoringUrl(url: string): string {
    return url
      // tslint:disable-next-line:max-line-length
      ? `/apis/authContent/${url.includes('/content-store/') ? new URL(url).pathname.slice(1) : encodeURIComponent(url)}`
      : ''
  }

  regexDownloadReplace = (_str = '', group1: string, group2: string): string => {
    return `${this.authoringBase}${encodeURIComponent(group1)}${group2}`
  }

  replaceToAuthUrl(data: any): any {
    return JSON.parse(
      JSON.stringify(data).replace(
        this.downloadRegex,
        this.regexDownloadReplace,
      ),
    )
  }
  readSections(assessmentId: string) {
    return `${this.API_ENDPOINTS}/${assessmentId}`
  }

  getPublicUrl(url: string): string {
    const mainUrl = url.split('/content').pop() || ''
    return `${environment.contentHost}/${environment.contentBucket}/content${mainUrl}`
  }

  getCdnUrl(url: string): string {
    const mainUrl = url.split('/content').pop() || ''
    return `${this.domainConfSvc.getDomainCDNHost()}/${environment.cdnContentBucket}/content${mainUrl}`
  }

  //  fetchContent(
  //   contentId: string,
  //   hierarchyType: 'all' | 'minimal' | 'detail' = 'detail'
  //   ): Observable<NsContent.IContent> {
  //     let url = ''
  //     const forPreview = window.location.href.includes('/public/') || window.location.href.includes('&preview=true')
  //       if (!forPreview) {
  //         url = `/apis/proxies/v8/action/content/v3/hierarchy/${contentId}?hierarchyType=${hierarchyType}`
  //       } else {
  //         url = `/api/course/v1/hierarchy/${contentId}?hierarchyType=${hierarchyType}`
  //       }
  //       return this.http.get<NsContent.IContent>(url)
  //   }

  fetchContent(id: string, type: string) {
    return this.http.get<NsContent.IContent>(`/apis/proxies/v8/action/content/v3/hierarchy/${id}?mode=${type}`)
  }

  updateContentHashMapForAssesstent(contentId: string, contentProgress: any) {
    if (this.tocSvc.hashmap[contentId] &&
      (!this.tocSvc.hashmap[contentId]['completionStatus'] || this.tocSvc.hashmap[contentId]['completionStatus'] < 2)) {
      this.tocSvc.hashmap[contentId]['completionPercentage'] = contentProgress.completionPercentage
      this.tocSvc.hashmap[contentId]['completionStatus'] = contentProgress.status
      this.tocSvc.hashmap = { ...this.tocSvc.hashmap }
    }
  }

  getFormById(formId: string) {
    return this.http.get(this.API_ENDPOINTS.GET_FORM_BYID(formId))
  }

  submitForm(formData: any) {
    return this.http.post<any>(this.API_ENDPOINTS.SUBMIT_FORM, formData)
  }

  realTimeProgressUpdateForPreAssessment(contentId: string, request: any) {
    let req: any
    if (this.configservice.userProfile) {
      req = {
        request: {
          userId: this.configservice.userProfile.userId || '',
          contents: [
            {
              contentId,
              // batchId,
              status: this.getStatus(request.current, request.max_size, request.mime_type),
              // courseId: collectionId,
              lastAccessTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss:SSSZZ'),
              progressdetails: {
                max_size: request.max_size,
                current: request.current,
                mimeType: request.mime_type,
              },
              completionPercentage: this.calculatePercent(request.current, request.max_size, request.mime_type),
            },
          ],
        },
      }
      // if (this.configservice.cstoken !== '') {
      //   const headers = new HttpHeaders()
      //   .set('cstoken', this.configservice.cstoken)

      //   this.http
      //   .patch(`${this.API_ENDPOINTS.PROGRESS_UPDATE}/${contentId}`, { headers } , req)
      //   .subscribe(noop, noop)
      // } else {
      //   this.http
      //   .patch(`${this.API_ENDPOINTS.PROGRESS_UPDATE}/${contentId}`, req)
      //   .subscribe(noop, noop)
      // }
      // this.http
      //   .patch(`${this.API_ENDPOINTS.PROGRESS_UPDATE}/${contentId}`, req)
      //   .subscribe(noop, noop)
      //const contentIdNew= req.request.contents[0].contentId
      // const updatedCompletionPercentage = req.request.contents[0].completionPercentage
      // const updatedStatus = req.request.contents[0].status

      // // Clone the inner object and update
      // const existingContent = this.tocSvc.hashmap[contentIdNew] || {}

      // this.tocSvc.hashmap = {
      //   ...this.tocSvc.hashmap,
      //   [contentIdNew]: {
      //     ...existingContent,
      //     completionPercentage: updatedCompletionPercentage,
      //     completionStatus: updatedStatus
      //   }
      // }
      // console.log('req', JSON.stringify(req))
      // console.log('req', req)

      const resourceStatus = this.getPreAssessmentResourceStatus(contentId)
      if (resourceStatus < 2) {
        this.http
          .patch(`${this.API_ENDPOINTS.PRE_ASSESSMENT_STATE_UPDATE}`, req)
          .subscribe(noop, noop)
      }
      if (this.tocSvc.hashmap[contentId] &&
        (!this.tocSvc.hashmap[contentId]['completionStatus'] || this.tocSvc.hashmap[contentId]['completionStatus'] < 2)) {
        this.tocSvc.hashmap[contentId]['completionPercentage'] = req.request.contents[0].completionPercentage
        this.tocSvc.hashmap[contentId]['completionStatus'] = req.request.contents[0].status
        this.tocSvc.hashmap[contentId]['parent'] = req.request.contents[0].courseId
        this.tocSvc.hashmap[contentId]['progress'] = req.request.contents[0].progressdetails
        this.tocSvc.hashmap = { ...this.tocSvc.hashmap }
      }

      // console.log('Updated hashmap:', this.tocSvc.hashmap)

      // console.log('this.tocSvc.hashmap---', this.tocSvc.hashmap)
    } else {
      req = {}
      // do nothing
    }
  }

  realTimeProgressUpdateForPreAssessmentQuiz(contentId: string, status?: number, mimeType?: string) {
    let req: any
    if (this.configservice.userProfile) {
      req = {
        request: {
          //userId: this.configservice.userProfile.userId || '',
          contents: [
            {
              contentId,
              // batchId,
              status: status || 2,
              // courseId: collectionId,
              lastAccessTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss:SSSZZ'),
              completionPercentage: status === 2 ? 100.0 : 0,
              progressdetails: {
                "mimeType": mimeType || "application/vnd.sunbird.questionset"
              },
            },
          ],
        },
      }
      const resourceStatus = this.getPreAssessmentResourceStatus(contentId)
      if (resourceStatus < 2) {
        this.http
          .patch(`${this.API_ENDPOINTS.PRE_ASSESSMENT_STATE_UPDATE}`, req)
          .subscribe(noop, noop)
      }
      if (this.tocSvc.hashmap && this.tocSvc.hashmap[contentId] && req.request.contents[0]) {
        if (this.tocSvc.hashmap[contentId] &&
          (!this.tocSvc.hashmap[contentId]['completionStatus'] || this.tocSvc.hashmap[contentId]['completionStatus'] < 2)) {
          this.tocSvc.hashmap[contentId]['completionPercentage'] = req.request.contents[0].completionPercentage
          this.tocSvc.hashmap[contentId]['completionStatus'] = req.request.contents[0].status
          this.tocSvc.hashmap = { ...this.tocSvc.hashmap }
        }
      }
    } else {
      req = {}
      // do nothing
    }
  }

  getPreAssessmentResourceStatus(resourceId: string) {
    if (this.tocSvc && this.tocSvc.hashmap && this.tocSvc.hashmap[resourceId]) {
      return this.tocSvc.hashmap[resourceId]['completionStatus'] || 1
    }
    return 1
  }


}
