import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { Observable, of } from 'rxjs'
import { TopicService } from '../services/topics.service'
import { catchError, map } from 'rxjs/operators'

@Injectable()
export class TopicResolverService  {

    constructor(private topicService: TopicService) { }
    resolve(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<any> {
        return this.topicService.loadTopics().pipe(
            map((data: any) => {
                return { data: data.terms || [], error: null }
            }),
            catchError((err: any) => {
                return of({ data: null, error: err })
            })
        )
    }
}
