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

  config = {
    userName:
      'nptest',
    context: {
      id: 1,
    },
    categories: { result: ['2'] },
    routerSlug: '/app',
    path: '',

  }

  getConfig(key: any): IdiscussionConfig {
    return localStorage.getItem(key)
  }

}
