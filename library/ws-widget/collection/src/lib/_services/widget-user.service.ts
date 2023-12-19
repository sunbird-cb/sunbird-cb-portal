import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { IUserGroupDetails } from './widget-user.model'
import { NsContent } from './widget-content.model'
import 'rxjs/add/observable/of'
import dayjs from 'dayjs'
import { environment } from 'src/environments/environment'

const PROTECTED_SLAG_V8 = '/apis/protected/v8'
const API_END_POINTS = {
  FETCH_USER_GROUPS: (userId: string) =>
    `${PROTECTED_SLAG_V8}/user/group/fetchUserGroup?userId=${userId}`,
    FETCH_CPB_PLANS:`/apis/proxies/v8/user/v1/cbplan`,
  FETCH_USER_ENROLLMENT_LIST: (userId: string | undefined) =>
    // tslint:disable-next-line: max-line-length
    `/apis/proxies/v8/learner/course/v1/user/enrollment/list/${userId}?orgdetails=orgName,email&licenseDetails=name,description,url&fields=contentType,primaryCategory,topic,name,channel,mimeType,appIcon,gradeLevel,resourceType,identifier,medium,pkgVersion,board,subject,trackable,posterImage,duration,creatorLogo,license,version,versionKey,avgRating,additionalTags&batchDetails=name,endDate,startDate,status,enrollmentType,createdBy,certificates,batchAttributes`,
  FETCH_USER_ENROLLMENT_LIST_PROFILE: (userId: string | undefined) =>
    // tslint:disable-next-line: max-line-length
    `/apis/proxies/v8/learner/course/v1/user/enrollment/list/${userId}?orgdetails=orgName,email&licenseDetails=name,description,url&fields=contentType,primaryCategory,topic,name,channel,mimeType,appIcon,gradeLevel,resourceType,identifier,medium,pkgVersion,board,subject,trackable,posterImage,duration,creatorLogo,license,version,versionKey,avgRating,additionalTags&batchDetails=name,endDate,startDate,status,enrollmentType,createdBy,certificates,batchAttributes&retiredCoursesEnabled=true`,
  // tslint:disable-next-line: max-line-length
  FETCH_USER_ENROLLMENT_LIST_V2: (userId: string | undefined, orgdetails: string, licenseDetails: string, fields: string, batchDetails: string) =>
    // tslint:disable-next-line: max-line-length
    `apis/proxies/v8/learner/course/v1/user/enrollment/list/${userId}?orgdetails=${orgdetails}&licenseDetails=${licenseDetails}&fields=${fields}&batchDetails=${batchDetails}`,
}

@Injectable({
  providedIn: 'root',
})
export class WidgetUserService {
  constructor(private http: HttpClient) { }

  handleError(error: ErrorEvent) {
    let errorMessage = ''
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`
    }
    return throwError(errorMessage)
  }

  fetchUserGroupDetails(userId: string): Observable<IUserGroupDetails[]> {
    return this.http
      .get<IUserGroupDetails[]>(API_END_POINTS.FETCH_USER_GROUPS(userId))
      .pipe(catchError(this.handleError))
  }
 // tslint:disable-next-line: max-line-length
  fetchUserBatchList(userId: string | undefined, queryParams?: { orgdetails: any, licenseDetails: any, fields: any, batchDetails: any }): Observable<NsContent.ICourse[]> {
    let path = ''
    if (queryParams) {
       // tslint:disable-next-line: max-line-length
      path = API_END_POINTS.FETCH_USER_ENROLLMENT_LIST_V2(userId, queryParams.orgdetails, queryParams.licenseDetails, queryParams.fields, queryParams.batchDetails)
    } else {
      path = API_END_POINTS.FETCH_USER_ENROLLMENT_LIST(userId)
    }
    const headers = new HttpHeaders({
      'Cache-Control':  'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      Pragma: 'no-cache',
      Expires: '0',
    })
    if (this.checkStorageData('enrollmentService')) {
      const result: any =  this.http.get(path, { headers }).pipe(catchError(this.handleError), map(
          (data: any) => {
            localStorage.setItem('enrollmentData', JSON.stringify(data.result))
            return data.result
          }
        )
      )
      this.setTime('enrollmentService')
      return result
    }
    return this.getData('enrollmentData')

  }

   // tslint:disable-next-line: max-line-length
  fetchProfileUserBatchList(userId: string | undefined, queryParams?: { orgdetails: any, licenseDetails: any, fields: any, batchDetails: any }): Observable<NsContent.ICourse[]> {
    let path = ''
    if (queryParams) {
       // tslint:disable-next-line: max-line-length
      path = API_END_POINTS.FETCH_USER_ENROLLMENT_LIST_V2(userId, queryParams.orgdetails, queryParams.licenseDetails, queryParams.fields, queryParams.batchDetails)
    } else {
      path = API_END_POINTS.FETCH_USER_ENROLLMENT_LIST_PROFILE(userId)
    }
    const headers = new HttpHeaders({
      'Cache-Control':  'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      Pragma: 'no-cache',
      Expires: '0',
    })
    return this.http
      .get(path, { headers })
      .pipe(
        catchError(this.handleError),
        map(
          (data: any) => data.result
        )
      )
  }

  checkStorageData(key: any) {
    const checkTime = localStorage.getItem('timeCheck')
    if (checkTime) {
      const parsedData = JSON.parse(checkTime)
      if (parsedData[key]) {
        const date = dayjs()
        const diffMin = date.diff(parsedData[key], 'minute')
        const timeCheck = environment.apiCache || 0
        if (diffMin >= timeCheck) {
          return true
        }
        return localStorage.getItem('enrollmentData') ? false : true
      }
      return true
    }
    return true
  }

  getData(key: any): Observable<any> {
    return Observable.of(JSON.parse(localStorage.getItem(key) || ''))
  }

  setTime(key: any) {
    const checkTime = localStorage.getItem('timeCheck')
    if (checkTime) {
      const parsedData = JSON.parse(checkTime)
      parsedData[key] = new Date().getTime()
      localStorage.setItem('timeCheck', JSON.stringify(parsedData))
    } else {
      const data: any = {}
      data[key] = new Date().getTime()
      localStorage.setItem('timeCheck', JSON.stringify(data))
    }
  }

  resetTime(key: any) {
    const checkTime = localStorage.getItem('timeCheck')
    if (checkTime) {
      const parsedData = JSON.parse(checkTime)
      if (parsedData[key]) {
       delete parsedData[key]
       localStorage.setItem('timeCheck', JSON.stringify(parsedData))
      }
    }
  }

  fetchCbpPlanList(userId:string) {
    const result: any =  this.http.get(API_END_POINTS.FETCH_CPB_PLANS).pipe(catchError(this.handleError), map(
      (data: any) => {
        // localStorage.setItem('enrollmentData', JSON.stringify(data.result))
        return data.result
      }
    )
  )
  // this.setTime('enrollmentService')
  return result
  }
}
