import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { Observable } from 'rxjs'
// import { map, catchError } from 'rxjs/operators'
import { } from '@sunbird-cb/collection'
// import { IResolveResponse } from '@sunbird-cb/utils-v2'
// import { DiscussService } from '../services/discuss.service'
// import { NSDiscussData } from '../models/discuss.model'
import { DiscussUtilsService } from '../services/discuss-utils.service'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
// import { DiscussUtilsService } from '../services/discuss-util.service'

@Injectable()
export class DiscussConfigResolve
   {
  constructor(private discussionSvc: DiscussUtilsService,
              public configSvc: ConfigurationsService) { }

  resolve(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Observable<any> {

    const config = {
      menuOptions: [
        {
          route: 'all-discussions',
          label: 'All discussions',
          enable: true,
        },
        {
          route: 'categories',
          label: 'Categories',
          enable: true,
        },
        {
          route: 'tags',
          label: 'Tags',
          enable: true,
        },
        {
          route: 'my-discussion',
          label: 'Your discussion',
          enable: true,
        },
      ],
      userName: (this.configSvc.nodebbUserProfile && this.configSvc.nodebbUserProfile.username) || '',
      context: {
        id: 1,
      },
      categories: { result: [] },
      routerSlug: '/app',
      headerOptions: false,
      bannerOption: true,
    }
    return (this.discussionSvc.getDiscussionConfig() ? this.discussionSvc.getDiscussionConfig() : config)
  }
}
