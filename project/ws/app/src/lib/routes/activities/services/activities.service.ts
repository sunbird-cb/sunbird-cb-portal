import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { IActivity } from '../interfaces/activities.model'

@Injectable({
  providedIn: 'root',
})
export class ActivitiesService {

  constructor(
    private configSvc: ConfigurationsService,
    private http: HttpClient) { }

  fetchActivites() {
    const activities: Promise<IActivity> = this.http
      .get<IActivity>(`${this.configSvc.baseUrl}/feature/activities.json`)
      .toPromise()
    return activities
  }

  fetchLearnActivites() {
    const activities: Promise<IActivity> = this.http
      .get<IActivity>(`${this.configSvc.baseUrl}/feature/learn-activities.json`)
      .toPromise()
    return activities
  }
}
