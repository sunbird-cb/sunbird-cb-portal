import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router'
import { Observable, of } from 'rxjs'
import { NSProfileDataV3 } from '../models/profile-v3.models'
import { catchError, map } from 'rxjs/operators'
import { ProfileV3Service } from '../services/profile_v3.service'

@Injectable()
export class CompetencyResolverService implements Resolve<Observable<NSProfileDataV3.ICompetencie[]>> {

    constructor(private compService: ProfileV3Service) { }
    resolve(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<any> {
        const searchJson = [
            { type: 'COMPETENCY', field: 'name', keyword: '' },
            { type: 'COMPETENCY', field: 'status', keyword: 'VERIFIED' },
        ]
        const searchObj = {
            searches: searchJson,
            childNodes: true,
        }
        return this.compService.getAllCompetencies(searchObj).pipe(
            map((data: any) => {
                return { data: data.responseData || [], error: null }
            }),
            catchError((err: any) => {
                return of({ data: null, error: err })
            })
        )
    }
}
