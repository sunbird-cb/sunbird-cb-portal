import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import * as _ from 'lodash'
import { ConfigurationsService } from '@sunbird-cb/utils'
import { ServerResponse } from 'http'
import { ApiService } from '@ws/author/src/lib/modules/shared/services/api.service'
// /lib/modules/shared/services/api.service.ts'

const urls = {
  HIERARCHY: 'course/v1/hierarchy',
  LEARNER_PREFIX: '/api/',
  PROXIES_PREFIX: '/apis/proxies/v8/',
  VALIDATE_CERTIFICATE: 'certreg/v1/certs/validate',
  DOWNLOAD_CERTIFICATE: (id: string) => `certreg/v2/certs/download/${id}`,
  DOWNLOAD_CERTIFICATE_v2: (id: string) => `apis/protected/v8/cohorts/course/batch/cert/download/${id}`,
  SEARCH_CERTIFICATE: 'certreg/v1/certs/search',
}

@Injectable({
  providedIn: 'root',
})
export class CertificateService {

  constructor(public apiService: ApiService, public configService: ConfigurationsService) { }

  validateCertificate(data: any): Observable<ServerResponse> {
    const option = {
      data,
      // url: `${urls.PROXIES_PREFIX}learner/${urls.VALIDATE_CERTIFICATE}`,
      url: `${urls.LEARNER_PREFIX}${urls.VALIDATE_CERTIFICATE}`,
    }
    return this.apiService.post(option.url, option.data)
  }

  downloadCertificate(id: string): Observable<ServerResponse> {
    const option = {
      url: `${urls.LEARNER_PREFIX}${urls.DOWNLOAD_CERTIFICATE(id)}`,
    }
    return this.apiService.get(option.url)
    // sample response
    //  {"id":"api.certs.registry.download","ver":"v2","ts":"1615529580406","params":null,"responseCode":"OK",
    // "result":{"printUri":"data:image/svg+xml
  }
  downloadCertificate_v2(id: string): Observable<ServerResponse> {
    const option = {
      url: `${urls.DOWNLOAD_CERTIFICATE_v2(id)}`,
    }
    return this.apiService.get(option.url)
    // sample response
    //  {"id":"api.certs.registry.download","ver":"v2","ts":"1615529580406","params":null,"responseCode":"OK",
    // "result":{"printUri":"data:image/svg+xml
  }
  searchCertificate(recipientId: string): Observable<ServerResponse> {
    const option = {
      url: `${urls.LEARNER_PREFIX}${urls.SEARCH_CERTIFICATE}`,
      data: {
        request: {
          _source: ['data.badge.issuer.name', 'pdfUrl', 'data.issuedOn', 'data.badge.name'],
          query: {
            bool: {
              must: [{
                match_phrase: { 'recipient.id': recipientId },
              }],
            },
          },
          size: 50,
        },
      },
    }
    return this.apiService.post(option.url, option.data)

  }
}
