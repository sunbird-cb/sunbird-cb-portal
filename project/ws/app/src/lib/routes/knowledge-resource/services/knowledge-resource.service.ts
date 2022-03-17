import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { NSKnowledgeResource } from '../models/knowledge-resource.models'
// tslint:disable
import _ from 'lodash'

// tslint:enable

const imageTypes = ['jpg', 'png', 'jpeg', 'image/png', 'image/jpg', 'image/jpeg']
const fileType = ['image', 'pdf', 'doc']

const API_ENDPOINTS = {
  getAllResource: '/apis/protected/v8/frac/getAllNodes/knowledgeResource',
  getSingleResource: (id: string, type: string) => `/apis/protected/v8/frac/getNodeById/${id}/${type}?bookmarks=true`,
  getBookmarkedResources: '/apis/protected/v8/frac/getAllNodes/knowledgeResource?bookmarks=true',
  getBookmarkedObject: '/apis/protected/v8/frac/bookmarkDataNode',
}

@Injectable({
  providedIn: 'root',
})

export class KnowledgeResourceService {

  knowledgeResource: NSKnowledgeResource.IResourceData | undefined

  constructor(private http: HttpClient) {}

  getAllResources(): Observable<any> {
    return this.http.get<NSKnowledgeResource.IResourceData[]>(API_ENDPOINTS.getBookmarkedResources)
    .pipe(map((data: any) => {
      _.each(_.get(data, 'responseData'), rd => {
        const fileList = _.get(rd, 'additionalProperties.krFiles')
        _.each(fileType, ft => {
          switch (ft) {
            case 'image':
            const  imageCount = this.countFileType(fileList, ft)
            _.set(rd, 'totalFiles.images' , imageCount)
            break

            case 'pdf':
              const  pdfCount = this.countFileType(fileList, ft)
              _.set(rd, 'totalFiles.pdf' , pdfCount)
            break

            case 'doc':
              const  docCount = this.countFileType(fileList, ft)
              _.set(rd, 'totalFiles.doc' , docCount)
            break

            default:
              const  otherCount = 0
              _.set(rd, 'totalFiles.others' , otherCount)
            break
          }

        })
      })

      return data
    }))
   }

  countFileType(fileList: NSKnowledgeResource.IKrFiles[], flType: string) {
      let count = 0
      if (fileList && fileList.length > 0 && fileType.includes(flType)) {
        if (flType === 'image') {
          count = (_.filter(fileList, f => _.includes(imageTypes, f.fileType)) || []).length
        } else {
          count = (_.filter(fileList, { fileType: flType }) || []).length
        }

      } else {

      }
      return count
  }

  addBookmark(data: any): Observable<any> {
    return this.http.post<NSKnowledgeResource.IResourceData>(API_ENDPOINTS.getBookmarkedObject, data)
  }

  getBookmarkedResource(): Observable<any> {
    return this.http.get<NSKnowledgeResource.IResourceData[]>(API_ENDPOINTS.getBookmarkedResources)
  }

  getResource(id: string, type: string): Observable<any> {
    const regularExpressionPdf = /.png/
    const regularExpressionPDF = /.jpg/
    return this.http.get<any>(API_ENDPOINTS.getSingleResource(id, type))
    .pipe(map((data: any) => {
      _.each(_.get(data, 'responseData.additionalProperties.krFiles'), files => {
        const isPng = ((_.get(files, 'url') || '').search(regularExpressionPdf)) > -1
        const isJpg = ((_.get(files, 'url') || '').search(regularExpressionPDF)) > -1
        if (isPng || isJpg) {
          _.set(files, 'fileType', 'IMAGE')
        } else {
          _.set(files, 'fileType', 'PDF')
        }

      })

      return data
    }
    ))

  }
}
