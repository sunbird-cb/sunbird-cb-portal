import { Injectable } from '@angular/core'
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { Observable, of } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
import { } from '@sunbird-cb/collection'
import { ConfigurationsService, IResolveResponse } from '@sunbird-cb/utils-v2'
import { CompetenceService } from '../services/competence.service'

@Injectable()
export class ProfileResolve
  implements
  Resolve<Observable<IResolveResponse<any>> | IResolveResponse<any>> {
  constructor(private competenceSvc: CompetenceService, private confSvc: ConfigurationsService) { }

  resolve(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Observable<IResolveResponse<any>> {
    return this.competenceSvc.fetchProfileById(this.confSvc.unMappedUser.id).pipe(
      map(data => ({ data: (data && data.profileDetails) || {}, error: null })),
      catchError(error => of({ error, data: null })),
    )
  }
}
