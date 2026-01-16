import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { IUserGroupDetails } from './widget-user.model'
import { NsContent } from './widget-content.model'
import 'rxjs/add/observable/of'
import dayjs from 'dayjs'
import { environment } from 'src/environments/environment'
import { NsCardContent } from '../card-content-v2/card-content-v2.model'
import lodash from 'lodash'

const PROTECTED_SLAG_V8 = '/apis/protected/v8'
const API_END_POINTS = {
  FETCH_USER_GROUPS: (userId: string) =>
    `${PROTECTED_SLAG_V8}/user/group/fetchUserGroup?userId=${userId}`,
    FETCH_CPB_PLANS: `/apis/proxies/v8/user/v1/cbplan`,
  FETCH_USER_ENROLLMENT_LIST: (userId: string | undefined) =>
    // tslint:disable-next-line: max-line-length
    `/apis/proxies/v8/learner/course/v2/user/enrollment/list/${userId}?orgdetails=orgName,email&licenseDetails=name,description,url&fields=contentType,primaryCategory,courseCategory,topic,name,channel,mimeType,appIcon,gradeLevel,resourceType,identifier,medium,pkgVersion,board,subject,trackable,posterImage,duration,creatorLogo,license,version,versionKey,avgRating,additionalTags,${NsCardContent.COMPENTENCYKEY}&batchDetails=name,endDate,startDate,status,enrollmentType,createdBy,certificates,batchAttributes`,
  FETCH_USER_ENROLLMENT_LIST_PROFILE: (userId: string | undefined) =>
    // tslint:disable-next-line: max-line-length
    `/apis/proxies/v8/learner/course/v2/user/enrollment/list/${userId}?orgdetails=orgName,email&licenseDetails=name,description,url&fields=contentType,primaryCategory,courseCategory,topic,name,channel,mimeType,appIcon,gradeLevel,resourceType,identifier,medium,pkgVersion,board,subject,trackable,posterImage,duration,creatorLogo,license,version,versionKey,avgRating,additionalTags,${NsCardContent.COMPENTENCYKEY}&batchDetails=name,endDate,startDate,status,enrollmentType,createdBy,certificates,batchAttributes&retiredCoursesEnabled=true`,
  // tslint:disable-next-line: max-line-length
  FETCH_USER_ENROLLMENT_LIST_V2: (userId: string | undefined, orgdetails: string, licenseDetails: string, fields: string, batchDetails: string) =>
    // tslint:disable-next-line: max-line-length
    `apis/proxies/v8/learner/course/v2/user/enrollment/list/${userId}?orgdetails=${orgdetails}&licenseDetails=${licenseDetails}&fields=${fields},courseCategory,${NsCardContent.COMPENTENCYKEY}&batchDetails=${batchDetails}`,
}

@Injectable({
  providedIn: 'root',
})
export class WidgetUserService {
  constructor(private http: HttpClient) { }

  compentencyKey = environment.compentencyVersionKey

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
    if (this.checkStorageData('enrollmentService', 'enrollmentData')) {
      const result: any =  this.http.get(path, { headers }).pipe(catchError(this.handleError), map(
          (data: any) => {

            const coursesData: any = []
            if (data && data.result && data.result.courses) {
              data.result.courses.forEach((content: any) => {
                if (content.contentStatus) {
                  delete content.contentStatus
                }
                coursesData.push(content)
              })
              this.storeUserEnrollmentInfo(data.result.userCourseEnrolmentInfo,
                                           data.result.courses.length)
              data.result.courses = coursesData
              if (data.result.courses.length < 200) {
                localStorage.removeItem('enrollmentData')
                this.setTime('enrollmentService')
                localStorage.setItem('enrollmentData', JSON.stringify(data.result))
                this.mapEnrollmentData(data.result)
                return data.result
              }
            }
            this.mapEnrollmentData(data.result)
            return data.result
          }
        )
      )
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
    // if (this.checkStorageData('enrollmentService')) {
    //   const result: any =  this.http.get(path, { headers }).pipe(catchError(this.handleError), map(
    //       (data: any) => {
    //         localStorage.setItem('enrollmentData', JSON.stringify(data.result))
    //         this.mapEnrollmentData(data.result)
    //         return data.result
    //       }
    //     )
    //   )
    //   this.setTime('enrollmentService')
    //   return result
    // }
    // return this.getData('enrollmentData')
  }

  checkStorageData(key: any, dataKey: any) {
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
        return localStorage.getItem(dataKey) ? false : true
      }
      return true
    }
    return true
  }

  getData(key: any): Observable<any> {
    return Observable.of(JSON.parse(localStorage.getItem(key) || '{}'))
  }
  getSavedData(key: any): Observable<any> {
    return JSON.parse(localStorage.getItem(key) || '')
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

  fetchCbpPlanList() {

    // let data = JSON.parse(localStorage.getItem('cbpData')|| '')
    // if(!data) {
    //   this.http.get(API_END_POINTS.FETCH_CPB_PLANS).pipe(catchError(this.handleError), map(
    //     (data: any) => {
    //       const courseData = this.mapData(data.result)
    //       return courseData
    //     }
    //   )
    //   )
    // } else {
    //   return this.getData('cbpData')

    // }
     if (this.checkStorageData('cbpService', 'cbpData')) {
        const result: any = this.http.get(API_END_POINTS.FETCH_CPB_PLANS).pipe(catchError(this.handleError), map(
          async (data: any) => {
            return await this.mapData(data.result)
          }
        )
      )
      this.setTime('cbpService')
      return result
    }
    return this.getData('cbpData')
  }

  async mapData(data: any) {
    const contentNew: any = []
    const todayDate = dayjs().format('YYYY-MM-DD')

    const enrollList: any = JSON.parse(localStorage.getItem('enrollmentMapData') || '{}')

    if (data && data.count) {
      data.content.forEach((c: any) => {
        c.contentList.forEach((childData: any) => {
          const childEnrollData = enrollList[childData.identifier]
          const endDate = dayjs(c.endDate).format('YYYY-MM-DD')
          const daysCount = dayjs(endDate).diff(todayDate, 'day')
          childData['planDuration'] =  daysCount < 0 ? NsCardContent.ACBPConst.OVERDUE : daysCount > 29
          ? NsCardContent.ACBPConst.SUCCESS : NsCardContent.ACBPConst.UPCOMING
          childData['endDate'] = c.endDate
          childData['parentId'] = c.id
          childData['planType'] = 'cbPlan'
          if (childData.status !== NsCardContent.IGOTConst.RETIRED) {
            contentNew.push(childData)
          } else {
            if (childEnrollData && childEnrollData.status === 2) {
              contentNew.push(childData)
            }
          }

          const competencyArea: any = []
          const competencyTheme: any = []
          const competencyThemeType: any = []
          const competencySubTheme: any = []
          const competencyAreaId: any = []
          const competencyThemeId: any = []
          const competencySubThemeId: any = []
          childData['contentStatus'] = 0
          if (childEnrollData) {
            childData['contentStatus'] = childEnrollData.status
          }
         if (childData[this.compentencyKey]) {
          childData[this.compentencyKey].forEach((element: any) => {
            if (!competencyArea.includes(element.competencyArea)) {
              competencyArea.push(element.competencyArea)
              competencyAreaId.push(element.competencyAreaId)
            }
            if (!competencyTheme.includes(element.competencyTheme)) {
              competencyTheme.push(element.competencyTheme)
              competencyThemeId.push(element.competencyThemeId)
            }
            if (!competencyThemeType.includes(element.competencyThemeType)) {
              competencyThemeType.push(element.competencyThemeType)
            }
            if (!competencySubTheme.includes(element.competencySubTheme)) {
              competencySubTheme.push(element.competencySubTheme)
              competencySubThemeId.push(element.competencySubThemeId)
            }
          })
         }

          childData['competencyArea'] = competencyArea
          childData['competencyTheme'] = competencyTheme
          childData['competencyThemeType'] = competencyThemeType
          childData['competencySubTheme'] = competencySubTheme
          childData['competencyAreaId'] = competencyAreaId
          childData['competencyThemeId'] = competencyThemeId
          childData['competencySubThemeId'] = competencySubThemeId
        })
      })
     if (contentNew.length > 1) {
        const sortedData: any = contentNew.sort((a: any, b: any) => {
          const firstDate: any = new Date(a.endDate)
          const secondDate: any = new Date(b.endDate)

          return  secondDate > firstDate  ? 1 : -1
        })
        const uniqueUsersByID = lodash.uniqBy(sortedData, 'identifier')
        const sortedByEndDate =  lodash.orderBy(uniqueUsersByID, ['endDate'], ['asc'])
        const sortedByStatus =  lodash.orderBy(sortedByEndDate, ['contentStatus'], ['asc'])
        localStorage.setItem('cbpData', JSON.stringify(sortedByStatus))
        return sortedByStatus
     }
     localStorage.setItem('cbpData', JSON.stringify(contentNew))
     return contentNew
    }
    localStorage.setItem('cbpData', JSON.stringify([]))
    return []
  }

  mapEnrollmentData(courseData: any) {
    const enrollData: any = {}
    if (courseData && courseData.courses.length) {
      courseData.courses.forEach((data: any) => {
          enrollData[data.collectionId] = data
      })
    }
    localStorage.removeItem('enrollmentMapData')
    localStorage.setItem('enrollmentMapData', JSON.stringify(enrollData))
  }
  storeUserEnrollmentInfo(enrollmentData: any, enrolledCourseCount: number) {
    const userData = {
      enrolledCourseCount,
      userCourseEnrolmentInfo: enrollmentData,
    }
    localStorage.removeItem('userEnrollmentCount')
    localStorage.setItem('userEnrollmentCount', JSON.stringify(userData))
  }
}
