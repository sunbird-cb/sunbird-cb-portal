import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { Observable, of } from 'rxjs'
import { IResolveResponse, ConfigurationsService } from '@sunbird-cb/utils-v2'
import { NsDiscussionForum, WsDiscussionForumService } from '@sunbird-cb/collection'
import { map, catchError } from 'rxjs/operators'

@Injectable()
export class SocialTimelineResolverService  {

  userId = ''
  constructor(
    private discussionSvc: WsDiscussionForumService,
    private configSvc: ConfigurationsService,
  ) {
    if (this.configSvc.userProfile) {
      this.userId = this.configSvc.userProfile.userId || ''
    }
  }

  resolve(
    route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Observable<IResolveResponse<{ request: NsDiscussionForum.ITimelineRequest, response: NsDiscussionForum.ITimeline }>> {
    if (route.data.postKind) {
      const request: NsDiscussionForum.ITimelineRequest = {
        postKind: route.data.postKind,
        pgNo: 0,
        pgSize: 10,
        sessionId: Date.now(),
        userId: this.userId,
        type: ((route.queryParamMap.get('tab') as NsDiscussionForum.ETimelineType) || route.data.type),
      }
      return this.discussionSvc.fetchTimelineData(request)
        .pipe(
          map(data => ({ data: { request, response: data }, error: null })),
          catchError((error: any) => of({ error, data: null })),
        )
    }
    return of({ error: 'INVALID_POST_KIND', data: null })
  }
}
