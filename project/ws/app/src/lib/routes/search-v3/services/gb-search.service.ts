import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, of, Subject } from 'rxjs'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import {
  ISearchAutoComplete,
  ISearchQuery,
} from '../../search/models/search.model'
import { SearchApiService } from '../../search/apis/search-api.service'
import {
  SearchCommunitiesRequest,
  SearchExternalRequest,
  SearchNLP,
  SearchPeoplesRequest,
  SearchV4Request,
  SortType,
} from '../models/search-v3.model'
import { SEARCH_SORT_DROPDOWN } from '@ws/author/src/lib/constants/constant'

const API_END_POINTS = {
  SEARCH_V6: `/apis/proxies/v8/sunbirdigot/search`,
  SEARCH_V4: `/apis/proxies/v8/sunbirdigot/v4/search`,
  SEARCH_EXT_CONTENT: `/apis/proxies/v8/cios/v1/search/content`,
  // SEARCH_PEOPLE: `/apis/protected/v8/connections/v2/connections/recommended`,
  SEARCH_PEOPLE: `/apis/proxies/v8/user/v5/public/search`,
  SEARCH_COMMUNITY: `/apis/proxies/v8/community/v1/search`,
  SEARCH_NLP: `/apis/proxies/v8/nlp/search`,
  RECENT_CREATE: `apis/proxies/v8/search/v1/recent/create`,
  RECENT_READ: `apis/proxies/v8/search/v1/recent/read`,
  RECENT_DELETE_BY_USERID: `apis/proxies/v8/search/v1/recent/delete`,
  RECENT_DELETE_BY_TIMESTAMP: (id: string) => { return `apis/proxies/v8/search/v1/recent/delete/timestamp/${id}` },
  ENROLLMENT_API(userId: string): string {
    return `/apis/proxies/v8/learner/course/v4/user/enrollment/list/${userId}`
  },

  EXPLORE_API: '/api/course/v1/explore',
  MICRO_CREDENTIALS: `apis/proxies/v8/promotionalcontent/v1/assignedto/users`,
  GetApplicationsById: `apis/proxies/v8/forms/v2/bulkGetApplicationsById`
}

@Injectable({
  providedIn: 'root',
})
export class GbSearchService {
  private removeFilter = new Subject<any>();
  searchConfig: any = null;
  /**
   * Observable string streams
   */
  notifyObservable$ = this.removeFilter.asObservable();
  constructor(
    private http: HttpClient,
    private configSrv: ConfigurationsService,
    private searchApi: SearchApiService
  ) { }

  fetchSearchData(request: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.SEARCH_V6, request)
  }
  fetchSearchDataByCategory(request: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.SEARCH_V4, request)
  }
  fetchSearchDataforCios(request: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.SEARCH_EXT_CONTENT, request)
  }
  public notifyOther(data: any) {
    if (data) {
      this.removeFilter.next(data)
    }
  }

  async getSearchConfig(): Promise<any> {
    if (!this.searchConfig) {
      this.searchConfig = {}
      const baseUrl = this.configSrv.sitePath
      this.searchConfig = await this.http
        .get<any>(`${baseUrl}/feature/search.json`)
        .toPromise()
    }
    return of(this.searchConfig).toPromise()
  }
  searchAutoComplete(params: ISearchQuery): Promise<ISearchAutoComplete[]> {
    params.q = params.q.toLowerCase()
    if (params.l.split(',').length === 1 && params.l.toLowerCase() !== 'all') {
      return this.searchApi.getSearchAutoCompleteResults(params).toPromise()
    }
    return Promise.resolve([])
  }

  searchCoursesv4(params: SearchV4Request): Promise<any> {
    return this.http.post(API_END_POINTS.SEARCH_V4, params).toPromise()
  }

  getApplicationsById(formBody: any) {
    return this.http.post<any>(API_END_POINTS.GetApplicationsById, formBody)
  }

  searchConnections(params: SearchPeoplesRequest): Promise<any> {
    return this.http
      .post(API_END_POINTS.SEARCH_PEOPLE, { request: params })
      .toPromise()
  }

  searchCommunity(params: SearchCommunitiesRequest): Promise<any> {
    return this.http.post(API_END_POINTS.SEARCH_COMMUNITY, params).toPromise()
  }

  searchResource(params: SearchV4Request): Promise<any> {
    return this.http.post(API_END_POINTS.SEARCH_V6, params).toPromise()
  }

  nlpSearch(params: SearchNLP): Promise<any> {
    return this.http.post(API_END_POINTS.SEARCH_NLP, params).toPromise()
  }
  recentCreate(req: any): Promise<any> {
    return this.http.post(API_END_POINTS.RECENT_CREATE, req).toPromise()
  }
  recentRead() {
    return this.http.get(API_END_POINTS.RECENT_READ)
  }

  recentDeleteByUser() {
    return this.http.delete(API_END_POINTS.RECENT_DELETE_BY_USERID)
  }
  recentDeleteByTime(id: any) {
    return this.http.delete(API_END_POINTS.RECENT_DELETE_BY_TIMESTAMP(id))
  }

  enrollment(request: any, userId: string): any {
    return this.http.post(API_END_POINTS.ENROLLMENT_API(userId), request)
  }

  searchExternalContent(params: SearchExternalRequest): Promise<any> {
    return this.http.post(API_END_POINTS.SEARCH_EXT_CONTENT, params).toPromise()
  }

  exploreContent() {
    return this.http.get(API_END_POINTS.EXPLORE_API)
  }



  getFirstSortOption(isExploreContentTab: boolean): any {
    let options = SEARCH_SORT_DROPDOWN
    let selectedOption = SortType.MostRelevent
    if (isExploreContentTab) {
      options = SEARCH_SORT_DROPDOWN.filter(option => option.value !== SortType.MostRelevent)
      selectedOption = SortType.RecentlyAdded
    } else {
      options = SEARCH_SORT_DROPDOWN
      selectedOption = SortType.MostRelevent
    }
    return { options, selectedOption }
  }


  microCredentialsSearch(): Observable<any> {
    return this.http.get<any>(API_END_POINTS.MICRO_CREDENTIALS)
  }

}
