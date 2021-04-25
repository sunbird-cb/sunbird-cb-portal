import { Injectable  } from '@angular/core'
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { Observable } from 'rxjs'
// import { map, catchError } from 'rxjs/operators'
import { } from '@sunbird-cb/collection'
// import { IResolveResponse } from '@sunbird-cb/utils'
// import { DiscussService } from '../services/discuss.service'
// import { NSDiscussData } from '../models/discuss.model'
import { DiscussUtilsService } from '../services/discuss-utils.service'
import { ConfigurationsService } from '@sunbird-cb/utils'
// import { DiscussUtilsService } from '../services/discuss-util.service'

@Injectable()
export class DiscussConfigResolve
  implements
  Resolve<any> {
  constructor(private discussionSvc: DiscussUtilsService,
              public configSvc: ConfigurationsService) { }

  resolve(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Observable<any> {

    const config = {
      // menuOptions: [
      //   {
      //     route: 'categories',
      //     enable: true,
      //   },
      //   {
      //     route: 'tags',
      //     enable: true,
      //   },
      //   {
      //     route: 'all-discussions',
      //     enable: true,
      //   },
      //   {
      //     route: 'my-discussion',
      //     enable: false,
      //   },
      // ],
      userName: (this.configSvc.nodebbUserProfile && this.configSvc.nodebbUserProfile.username) || '',
      context: {
        id: 1,
      },
      categories: { result: [] },
      routerSlug: '/app',

    }
    return (this.discussionSvc.getDiscussionConfig() ? this.discussionSvc.getDiscussionConfig() : config)
  }
}
