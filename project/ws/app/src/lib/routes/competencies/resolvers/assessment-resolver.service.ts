import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { Observable, of } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
import { } from '@sunbird-cb/collection'
import { IResolveResponse } from '@sunbird-cb/utils-v2'
import { CompetenceAssessmentService } from '../services/comp-assessment.service'
// tslint:disable-next-line
import _ from 'lodash'

@Injectable()
export class AssessmentResolverService
     {
    constructor(private competenceSvc: CompetenceAssessmentService) { }

    resolve(
        route: ActivatedRouteSnapshot,
        _state: RouterStateSnapshot,
    ): Observable<IResolveResponse<any>> {
        const id = route.params['assessmentId']
        return this.competenceSvc.fetchAssessment(id).pipe(
            map((data: any) => ({ data: _.get(data, 'result.questionSet') || {}, error: null })),
            catchError(error => of({ error, data: null })),
        )
    }
}
