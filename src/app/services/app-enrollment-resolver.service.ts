import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { ConfigurationsService, DataTransferService, IResolveResponse } from '@sunbird-cb/utils-v2'
import { Observable, of } from 'rxjs'
import { catchError, map, tap } from 'rxjs/operators'

const PROXIES_V8 = '/apis/proxies/v8';
const  ENROLL_CONTENT_DATA= `${PROXIES_V8}/learner/course/v4/user/enrollment/details`
@Injectable()
export class AppEnrollmentResolverService
     {
    constructor(private configSvc: ConfigurationsService,
        private http: HttpClient,
        private dataTransfer: DataTransferService,
        ) {}

    resolve(
        _route: ActivatedRouteSnapshot,
        _state: RouterStateSnapshot,
    ): Observable<IResolveResponse<any>> {
        let userId
        if (this.configSvc.userProfile) {
          userId = this.configSvc.userProfile.userId || ''
        }
        
        
        if (window.location.href.includes('/public/') || window.location.href.includes('&preview=true')) {
            return of({ error: null, data: null })
        }
        let enrollData = this.dataTransfer.getEnrollData()
        if(enrollData && enrollData.length) {
            return of({ error: null, data: {courses: enrollData} })
        } else {
            let request: any = {
                "request": {
                    "retiredCoursesEnabled": true,
                    "courseId": [_route.queryParams.collectionId],
                }
              }
            return  this.http.post(`${ENROLL_CONTENT_DATA}/${userId}`,request).pipe(
                map((rData: any) => 
                    {
                        
                        if(rData.result && rData.result.courses && rData.result.courses.length) {
                            this.dataTransfer.setEnrollData(rData.result.courses)
                        }
                        return { data: rData.result, error: null }
                    }), //  (rData.responseData || []).map((p: any) => p.name)
                    // tslint: disable-next-line: align
                    // @ts-ignore
                tap((resolveData: any) => {
                        // @ts-ignore
                        return of({ error: null, data: resolveData })
                        // @ts-ignore
                    }),
                    // tslint: disable-next-line: align
                    // @ts-ignore
                catchError((error: any) => of({ error, data: null })),
                )
        }
    }
}
