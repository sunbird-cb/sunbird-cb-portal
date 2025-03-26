import { Injectable } from '@angular/core'
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { } from '@sunbird-cb/collection'
import { IResolveResponse } from '@sunbird-cb/utils-v2'
import { NSKnowledgeResource } from '../models/knowledge-resource.models'
import { KnowledgeResourceService } from '../services/knowledge-resource.service'

@Injectable({
  providedIn: 'root',
})
export class ResourceDetailResolveService implements
  Resolve<Observable<IResolveResponse<NSKnowledgeResource.IResourceData>> |
  IResolveResponse<NSKnowledgeResource.IResourceData>> {
  constructor(private knowledeResource: KnowledgeResourceService) { }

  resolve(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Observable<IResolveResponse<NSKnowledgeResource.IResourceData>> {

    return this.knowledeResource.getResource('id' , 'type').pipe(
      map((data: any) => ({
           data,
           error: null,
        })),

      catchError(error => of({ error, data: null })),
    )

  }
}
