import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot  } from '@angular/router'
import { catchError, map } from 'rxjs/operators'
import { Observable, of } from 'rxjs'
import { IResolveResponse, NsContent } from '@sunbird-cb/utils-v2'
import { EventService } from './events.service'
@Injectable()
export class EventResolve
  implements
  Resolve<
  Observable<IResolveResponse<NsContent.IContent>> | IResolveResponse<NsContent.IContent> | null
  > {
  constructor(
    private eventService: EventService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IResolveResponse<NsContent.IContent>> | null {
    /* tslint:disable */
    console.log('route', route, state.url)
    /* tslint:enable */
    const urlStr = state.url.split('/')
    let eventId = ''
    /* tslint:disable */
    for (let i = 0; i < urlStr.length; i++) {
      if (urlStr[i].includes('do_')) {
        eventId = urlStr[i]
      }
    }
    /* tslint:disable */
    console.log('eventId', eventId)
    /* tslint:enable */
    return (
      this.eventService.getEventData(eventId
      )
    ).pipe(
      map((data: any) => {
        return { data: data.result.event, error: 'mimeTypeMismatch' }
      }),
      catchError(error => {
        return of({ error, data: null })
      }),
    )
  }
}
