import { Injectable } from '@angular/core'
import { AbstractConfigService, IdiscussionConfig } from '@project-sunbird/discussions-ui-v8'
// import { AbstractPageService } from '../../../projects/components/src/lib/services/abstract-page.service'

@Injectable({
  providedIn: 'root',
})
export class ConfigService extends AbstractConfigService {

  constructor() {
    super()
  }

  getConfig(key: any): IdiscussionConfig {
     // implementation for getting the configuration

    return localStorage.getItem(key)
  }

}
