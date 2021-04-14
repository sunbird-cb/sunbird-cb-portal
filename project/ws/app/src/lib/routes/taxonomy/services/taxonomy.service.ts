import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { ConfigurationsService, NsUser } from '@sunbird-cb/utils'

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
  fetchAllRelatedCourse(){
   var request ={
          filters: {
              primaryCategory: [
                  "Collection",
                  "Resource",
                  "Content Playlist",
                  "Course",
                  "Course Assessment",
                  "Digital Textbook",
                  "eTextbook",
                  "Explanation Content",
                  "Learning Resource",
                  "Lesson Plan Unit",
                  "Practice Question Set",
                  "Teacher Resource",
                  "Textbook Unit",
                  "LessonPlan",
                  "FocusSpot",
                  "Learning Outcome Definition",
                  "Curiosity Questions",
                  "MarkingSchemeRubric",
                  "ExplanationResource",
                  "ExperientialResource",
                  "Practice Resource",
                  "TVLesson"
              ]
          },
          query: "",
          sort_by: {
              "lastUpdatedOn": "desc"
          },
          fields: [
              "name",
              "appIcon",
              "mimeType",
              "gradeLevel",
              "identifier",
              "medium",
              "pkgVersion",
              "board",
              "subject",
              "resourceType",
              "primaryCategory",
              "contentType",
              "channel",
              "organisation",
              "trackable"
          ],
          facets: [
              "board",
              "gradeLevel",
              "subject",
              "medium",
              "primaryCategory",
              "mimeType"
          ]
      }
  console.log("comming")
    return this.http.post<any>(API_ENDPOINTS.getAllReleatedCourse,  {request})
  }



}
