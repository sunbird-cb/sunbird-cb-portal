import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import * as _ from 'lodash'
import { ConfigurationsService } from '@sunbird-cb/utils'
import { ServerResponse } from 'http'
import { ApiService } from '@ws/author/src/public-api'

const urls = {
  HIERARCHY: 'course/v1/hierarchy',
  LEARNER_PREFIX: '/learner/',
  VALIDATE_CERTIFICATE: 'certreg/v1/certs/validate',
}

@Injectable({
  providedIn: 'root',
})
export class CertificateService {

  constructor(public apiService: ApiService, public configService: ConfigurationsService) { }

  validateCertificate(data: any): Observable<ServerResponse> {
    const option = {
      data,
      url: `${urls.LEARNER_PREFIX}${urls.VALIDATE_CERTIFICATE}`,
    }
    return this.apiService.post(option.url, option.data)

  }
}
