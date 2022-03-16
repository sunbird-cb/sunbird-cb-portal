import { Injectable } from '@angular/core'
import { NsContent } from '@sunbird-cb/collection'
import { Subject, ReplaySubject } from 'rxjs'
import { IViewerTocCard } from './components/viewer-toc/viewer-toc.component'

export interface IViewerTocChangeEvent {
  tocAvailable: boolean
  nextResource: IViewerTocCard | null
  prevResource: IViewerTocCard | null
}
export interface IViewerResourceOptions {
  page?: {
    min: number
    max: number
    current: number
    queryParamKey: string
  }
  zoom?: {
    min: number
    max: number
    current: number
    queryParamKey: string
  }
}
export type TStatus = 'pending' | 'done' | 'error' | 'none'

@Injectable({
  providedIn: 'root',
})
export class ViewerDataService {
  resourceId: string | null = null
  resource: NsContent.IContent | null = null
  primaryCategory: string | null = null
  collectionId: string | null = null
  error: any
  status: TStatus = 'none'
  resourceChangedSubject = new Subject<string>()
  changedSubject = new ReplaySubject(1)
  tocChangeSubject = new ReplaySubject<IViewerTocChangeEvent>(1)
  navSupportForResource = new ReplaySubject<IViewerResourceOptions>(1)
  constructor() { }

  reset(resourceId: string | null = null, status: TStatus = 'none', primaryCategory?: string, collectionId?: string) {
    this.resourceId = resourceId
    this.resource = null
    this.error = null
    this.status = status
    this.primaryCategory = primaryCategory || ''
    this.collectionId = collectionId || '',
    this.changedSubject.next()
  }
  updateResource(resource: NsContent.IContent | null = null, error: any | null = null) {
    if (resource) {
      this.resource = resource
      if (resource && resource.identifier) {
        this.resourceId = resource.identifier
        this.primaryCategory = resource.primaryCategory
      }
      this.error = null
      this.status = 'done'
    } else {
      this.resource = null
      this.error = error
      this.status = 'error'
    }
    this.changedSubject.next()
  }
  updateNextPrevResource(isValid = true, prev: IViewerTocCard | null = null, next: IViewerTocCard | null = null) {
    this.tocChangeSubject.next(
      {
        tocAvailable: isValid,
        nextResource: next,
        prevResource: prev,
      },
    )
  }

}
