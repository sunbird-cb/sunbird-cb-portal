import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router'
import { NsContent, PipeContentRoutePipe, WidgetContentService } from '@sunbird-cb/collection'
import { IResolveResponse } from '@sunbird-cb/utils-v2'
import { Observable, of } from 'rxjs'
import { catchError, map, tap } from 'rxjs/operators'


@Injectable()
export class AppTocContentReadResolverService
   {
  constructor(
    private contentSvc: WidgetContentService,
    private routePipe: PipeContentRoutePipe,
    private router: Router,
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Observable<IResolveResponse<NsContent.IContent>> {
    const contentId = route.paramMap.get('id')
    if (contentId) {
      const forPreview = window.location.href.includes('/public/') || window.location.href.includes('&preview=true')
      return (forPreview
        ? this.contentSvc.fetchAuthoringContent(contentId,'read')
        : this.contentSvc.fetchContentData(contentId)
      ).pipe(
        map(data => ({ data, error: null })),
        tap((resolveData: any) => {
          resolveData.data = resolveData.data.result.content
          let currentRoute: string[] | string = window.location.href.split('/')
          currentRoute = currentRoute[currentRoute.length - 1]
          if (forPreview && currentRoute !== 'contents' && currentRoute !== 'overview') {
            this.router.navigate([
              // tslint:disable-next-line
              `${forPreview ? '/author' : '/app'}/toc/${resolveData.data.identifier}/overview?primaryCategory=${resolveData.data.primaryCategory}`,
            ])
          } else if (
            currentRoute === 'contents' &&
            resolveData.data &&
            !resolveData.data.children.length
          ) {
            this.router.navigate([
              `${forPreview ? '/author' : '/app'}/toc/${resolveData.data.identifier}/overview
              ?primaryCategory=${resolveData.data.primaryCategory}`,
            ])
          } else if (
            resolveData.data &&
            !forPreview &&
            (resolveData.data.primaryCategory === NsContent.EPrimaryCategory.CHANNEL ||
              resolveData.data.primaryCategory === NsContent.EPrimaryCategory.KNOWLEDGE_BOARD)
          ) {
            const urlObj = this.routePipe.transform(resolveData.data, forPreview)
            this.router.navigate([urlObj.url], { queryParams: urlObj.queryParams })
          }
          return of({ error: null, data: resolveData.data })
        }),
        catchError((error: any) => of({ error, data: null })),
      )
    }
    return of({ error: 'NO_ID', data: null })
  }
}
