import { Injectable, Type } from '@angular/core'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { AppTocCohortsComponent } from '../../components/app-toc-cohorts/app-toc-cohorts.component'

@Injectable({
  providedIn: 'root',
})
export class AppTocCohortsService {

  constructor(
    private configSvc: ConfigurationsService,
  ) { }

  getComponent(): Type<any> {
    switch (this.configSvc.rootOrg) {
      default:
        return AppTocCohortsComponent
    }
  }
}
