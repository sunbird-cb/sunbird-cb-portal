import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { NsContent, WidgetContentService } from '@sunbird-cb/collection'
import { IResolveResponse } from '@sunbird-cb/utils-v2'
import { Observable, of } from 'rxjs'
import { catchError, map, tap } from 'rxjs/operators'

const ADDITIONAL_FIELDS_IN_CONTENT = [
  'averageRating',
  'body',
  'creatorContacts',
  'creatorDetails',
  'curatedTags',
  'contentType',
  'collections',
  'hasTranslations',
  'expiryDate',
  'exclusiveContent',
  'introductoryVideo',
  'introductoryVideoIcon',
  'isInIntranet',
  'isTranslationOf',
  'keywords',
  'learningMode',
  'license',
  'playgroundResources',
  'price',
  'registrationInstructions',
  'region',
  'registrationUrl',
  'resourceType',
  'subTitle',
  'softwareRequirements',
  'studyMaterials',
  'systemRequirements',
  'totalRating',
  'uniqueLearners',
  'viewCount',
  'labels',
  'sourceUrl',
  'sourceName',
  'sourceShortName',
  'sourceIconUrl',
  'locale',
  'hasAssessment',
  'preContents',
  'postContents',
  'kArtifacts',
  'equivalentCertifications',
  'certificationList',
  'posterImage',
]
@Injectable()
export class AppPublicTocResolverService
   {
  constructor(
    private contentSvc: WidgetContentService,
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Observable<IResolveResponse<NsContent.IContent>> {
    const contentId = route.paramMap.get('id')
     if (contentId) {
       return this.contentSvc.fetchContent(contentId, 'detail', ADDITIONAL_FIELDS_IN_CONTENT, '').pipe(
        map(data => ({ data, error: null })),
        tap(resolveData => {
          resolveData.data = resolveData.data.result.content
          // let currentRoute: string[] | string = window.location.href.split('/')
          // currentRoute = currentRoute[currentRoute.length - 1]
          // if (!forPreview) {
          //   this.router.navigate([
          //     'public', 'toc', resolveData.data.identifier, 'preview'
          //    ])
          // }
          // if (
          //   resolveData.data &&
          //   !forPreview &&
          //   (resolveData.data.primaryCategory === NsContent.EPrimaryCategory.CHANNEL ||
          //     resolveData.data.primaryCategory === NsContent.EPrimaryCategory.KNOWLEDGE_BOARD)
          // ) {
          //   const urlObj = this.routePipe.transform(resolveData.data, forPreview)
          //   this.router.navigate([urlObj.url], { queryParams: urlObj.queryParams })
          // }
          return of({ error: null, data: resolveData.data })
        }),
        catchError((error: any) => of({ error, data: null })),
      )
    }
    return of({ error: 'NO_ID', data: null })
  }
}
