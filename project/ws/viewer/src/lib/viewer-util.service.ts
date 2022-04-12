import { ConfigurationsService } from '@sunbird-cb/utils'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { noop, Observable } from 'rxjs'
import dayjs from 'dayjs'
import { NsContent } from '@sunbird-cb/collection/src/lib/_services/widget-content.model'

@Injectable({
  providedIn: 'root',
})
export class ViewerUtilService {
  API_ENDPOINTS = {
    setS3Cookie: `/apis/v8/protected/content/setCookie`,
    // PROGRESS_UPDATE: `/apis/protected/v8/user/realTimeProgress/update`,
    PROGRESS_UPDATE: `/apis/proxies/v8/content-progres`,
    ASSESSMENT_SECTION: `/apis/proxies/v8/assessment/read`,
  }
  downloadRegex = new RegExp(`(/content-store/.*?)(\\\)?\\\\?['"])`, 'gm')
  authoringBase = '/apis/authContent/'
  constructor(private http: HttpClient, private configservice: ConfigurationsService) { }

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
          mimeType === NsContent.EMimeTypes.YOUTUBE
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
        mimeType === NsContent.EMimeTypes.M4A
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
      req = {
        request: {
          userId: this.configservice.userProfile.userId || '',
          contents: [
            {
              contentId,
              batchId,
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
    } else {
      req = {}
    }
    this.http
      .patch(`${this.API_ENDPOINTS.PROGRESS_UPDATE}/${contentId}`, req)
      .subscribe(noop, noop)
  }

  realTimeProgressUpdateQuiz(contentId: string, collectionId?: string, batchId?: string, status?: number) {
    let req: any
    if (this.configservice.userProfile) {
      req = {
        request: {
          userId: this.configservice.userProfile.userId || '',
          contents: [
            {
              contentId,
              batchId,
              status: status || 2,
              courseId: collectionId,
              lastAccessTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss:SSSZZ'),
            },
          ],
        },
      }
    } else {
      req = {}
    }
    this.http
      .patch(`${this.API_ENDPOINTS.PROGRESS_UPDATE}/${contentId}`, req)
      .subscribe(noop, noop)
  }

  getContent(contentId: string): Observable<NsContent.IContent> {
    return this.http.get<NsContent.IContent>(
      // tslint:disable-next-line:max-line-length
      // `/apis/authApi/action/content/hierarchy/${contentId}?rootOrg=${this.configservice.rootOrg || 'igot'}&org=${this.configservice.activeOrg || 'dopt'}`,
      `apis/proxies/v8/action/content/v3/read/${contentId}`
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
}
