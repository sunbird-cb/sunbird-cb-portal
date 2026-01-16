import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { map, tap } from 'rxjs/operators'
import _ from 'lodash'

const API_END_POINTS = {
  // GET_DEPARTMENTS: `/api/user/registration/v1/getDeptDetails`,
  REGISTER: `/api/user/registration/v1/register`,
  GET_ALL_STATES: '/apis/public/v8/org/v1/list',
  GET_DEPARTMENTS_OF_STATE: '/apis/public/v8/org/v1/list',
  GET_ORGS_OF_DEPT: '/apis/public/v8/org/v1/list',
  sendOtp: '/api/otp/v1/generate',
  ReSendOtp: '/api/otp/v1/generate',
  sendOtpExt: '/api/otp/ext/v1/generate',
  ReSendOtpExt: '/api/otp/ext/v1/generate',
  VerifyOtp: '/api/otp/v1/verify',
  GET_POSITIONS: '/api/user/v1/positions',
  GET_GROUPS: '/api/user/v1/groups',
  SEARCH_ORG: '/api/org/ext/v2/signup/search',
  ORG_READ: '/api/org/v1/read',
  ORGANISATION_FW: (frameworkName: string) =>
    `/api/framework/v1/read/${frameworkName}`,
  CHECK_REGISTRATION_LINK_STATUS: '/api/customselfregistration/isregistrationqractive',
  STATE_MINISTRY_FOR_REGISTRATION: 'apis/public/v8/org/hierarchy/search'
}

@Injectable({
  providedIn: 'root',
})
export class SignupService {
  private signupData = new BehaviorSubject({})
  updateSignupDataObservable = this.signupData.asObservable()
  list = new Map<string, any>()

  constructor(private http: HttpClient) { }

  // getDepartments(): Observable<any> {
  //   return this.http.get<any>(API_END_POINTS.GET_DEPARTMENTS)
  // }

  register(req: any) {
    return this.http.post<any>(
      API_END_POINTS.REGISTER, req
    )
  }

  getStatesOrMinisteries(type: string): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.GET_ALL_STATES}/${type}`)
  }
  getDeparmentsOfState(stateId: string): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.GET_DEPARTMENTS_OF_STATE}/${stateId}`)
  }
  getOrgsOfDepartment(deptId: string): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.GET_ORGS_OF_DEPT}/${deptId}`)
  }
  getPositions(): Observable<any> {
    return this.http.get<any>(API_END_POINTS.GET_POSITIONS)
  }

  getGroups(): Observable<any> {
    return this.http.get<any>(API_END_POINTS.GET_GROUPS)
  }

  sendOtp(value: any, type: string): Observable<any> {
    const reqObj = {
      request: {
        type: `${type}`,
        key: `${value}`,
      },
    }
    return this.http.post(API_END_POINTS.sendOtpExt, reqObj)
  }

  sendOtpV2(value: any, type: string): Observable<any> {
    const reqObj = {
      request: {
        type: `${type}`,
        key: `${value}`,
      },
    }
    return this.http.post(API_END_POINTS.sendOtp, reqObj)
  }
  
  resendOtp(value: any, type: string) {
    const reqObj = {
      request: {
        type: `${type}`,
        key: `${value}`,
      },
    }
    return this.http.post(API_END_POINTS.ReSendOtpExt, reqObj)

  }

  resendOtpv2(value: any, type: string) {
    const reqObj = {
      request: {
        type: `${type}`,
        key: `${value}`,
      },
    }
    return this.http.post(API_END_POINTS.ReSendOtp, reqObj)

  }
  verifyOTP(otp: number, value: any, type: string) {
    const reqObj = {
      request: {
        otp,
        type: `${type}`,
        key: `${value}`,
      },
    }
    return this.http.post(API_END_POINTS.VerifyOtp, reqObj)

  }

  searchOrgs(orgName: any, type: any) {
    const req = {
      request: {
        filters: {
          orgName,
          parentType: type,
        },
        limit: 500,
      },
    }
    return this.http.post(API_END_POINTS.SEARCH_ORG, req)
  }

  updateSignUpData(state: any) {
    this.signupData.next(state)
  }

  getOrgReadData(organisationId: string): Observable<any> {
    const request = {
      request: {
        organisationId,
      },
    };
    return this.http.post<any>(API_END_POINTS.ORG_READ, request).pipe(
      map((res: any) => {
        return _.get(res, 'result.response');
      })
    );
  }

  getFrameworkInfo(frameWorkName: string): Observable<any> {
    return this.http
      .get(`${API_END_POINTS.ORGANISATION_FW(frameWorkName)}`, {
        withCredentials: true,
      })
      .pipe(
        tap((response: any) => {
          this.formateData(response);
        })
      );
  }

  formateData(response: any) {
    _.get(response, 'result.framework.categories', []).forEach((a: any) => {
      this.list.set(a.code, {
        code: a.code,
        identifier: a.identifier,
        index: a.index,
        name: a.name,
        selected: a.selected,
        status: a.status,
        description: a.description,
        translations: a.translations,
        category: a.category,
        associations: a.associations,
        children: this.formateChildren(a.terms || []),
      });
    });

    const allCategories: any = [];
    this.list.forEach((a: any) => {
      allCategories.push({
        code: a.code,
        identifier: a.identifier,
        index: a.index,
        name: a.name,
        status: a.status,
        description: a.description,
        translations: a.translations,
      });
    });
  }

  formateChildren(terms: any[]): any[] {
    return terms.map((c: any) => {
      const associations = c.associations || [];
      if (associations.length > 0) {
        Object.assign(c, { children: associations });
        this.formateChildren(c.associations);
      } else {
        Object.assign(c, { children: [] });
      }
      const importedBy =
        _.get(c, 'additionalProperties.importedById', null) ===
          _.get({}, 'userId', '')
          ? 'You'
          : _.get(c, 'additionalProperties.importedByName', null);
      (c['importedByName'] = importedBy),
        (c['importedOn'] = _.get(c, 'additionalProperties.importedOn')),
        (c['importedById'] = _.get(c, 'additionalProperties.importedById'));
      return c;
    });
  }

  searchOrgsByIdentifier(req: any) {
    return this.http.post(API_END_POINTS.SEARCH_ORG, req)
  }

  getRegistrationLinkStatus(req: any) {
    return this.http.post(API_END_POINTS.CHECK_REGISTRATION_LINK_STATUS, req)
  }

  getStateOrMinistyForRegistration(req:any) {
    return this.http.post(API_END_POINTS.STATE_MINISTRY_FOR_REGISTRATION, req)
  }
}
