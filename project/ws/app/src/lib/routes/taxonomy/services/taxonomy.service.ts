import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { ConfigurationsService, NsUser } from '@sunbird-cb/utils-v2'

const API_ENDPOINTS = {
  getAllTopics: '/apis/protected/v8/catalog',
  getAllReleatedCourse: '/apis/proxies/v8/sunbirdigot/read',
  // Above line is to fetch own details only for loged in user.
}
/* this page needs refactor*/
@Injectable({
  providedIn: 'root',
})
export class TaxonomyService {
  usr: any
  constructor(
    private http: HttpClient, private configSvc: ConfigurationsService) {
    this.usr = this.configSvc.userProfile
  }

  get getUserProfile(): NsUser.IUserProfile {
    return this.usr
  }
  appendPage(page: any, url: string) {
    if (page) {
      return `${url}?page=${page}`
    }
    return `${url}?page=1`
  }
  fetchAllTopics() {
    return this.http.get<any>(API_ENDPOINTS.getAllTopics)
  }
  fetchAllRelatedCourse(identifier: any) {
   const request = {
        query: '',
        filters: {
            status: [
                'Live',
            ],
            contentType: [
                'Collection',
                'Course',
                'Learning Path',
            ],
            topics: identifier,
          },
          sort_by: {
              lastUpdatedOn: 'desc',
         },
          facets: [
              'primaryCategory',
              'mimeType',
        ],
    }
    return this.http.post<any>(API_ENDPOINTS.getAllReleatedCourse,  { request })
  }

}
