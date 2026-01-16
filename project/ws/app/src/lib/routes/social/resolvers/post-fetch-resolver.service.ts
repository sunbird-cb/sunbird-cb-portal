import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { Observable, of } from 'rxjs'
import { IResolveResponse, ConfigurationsService } from '@sunbird-cb/utils-v2'
import { NsDiscussionForum, WsDiscussionForumService } from '@sunbird-cb/collection'
import { map, catchError } from 'rxjs/operators'

@Injectable()
export class PostFetchResolverService  {

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
  ): Observable<IResolveResponse<{ request: NsDiscussionForum.IPostRequest, response: NsDiscussionForum.IPostResult }>> {
    const postId = route.paramMap.get('id')
    if (postId) {
      const request: NsDiscussionForum.IPostRequest = {
        postId,
        userId: this.userId,
        answerId: '',
        postKind: [NsDiscussionForum.EPostKind.REPLY],
        sessionId: Date.now(),
        pgNo: 0,
        pgSize: 5,
        sortOrder: NsDiscussionForum.EConversationSortOrder.LATEST_DESC,
      }
      return this.discussionSvc.fetchPost(request)
        .pipe(
          map(data => ({ data: { request, response: data }, error: null })),
          catchError((error: any) => of({ error, data: null })),
        )
    }
    return of({ error: 'NO_ID', data: null })
  }
}
