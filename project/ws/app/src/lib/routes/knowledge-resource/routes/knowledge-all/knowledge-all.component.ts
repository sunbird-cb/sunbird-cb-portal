import { Component, OnDestroy, OnInit } from '@angular/core'
import { map } from 'rxjs/operators'
import { ValueService } from '@sunbird-cb/utils'
import { KnowledgeResourceService } from '../../services/knowledge-resource.service'
import { NSKnowledgeResource } from '../../models/knowledge-resource.models'
import { ActivatedRoute } from '@angular/router'
// tslint:disable
import _ from 'lodash'
// tslint:enable

@Component({
  selector: 'ws-app-knowledge-all',
  templateUrl: './knowledge-all.component.html',
  styleUrls: ['./knowledge-all.component.scss'],
  // tslint:disable-next-line
  host: { class: 'flex flex-1 mt-6 knowledge_right' },
})
export class KnowledgeAllComponent implements OnInit, OnDestroy {

  isLtMedium$ = this.valueSvc.isLtMedium$
  private defaultSideNavBarOpenedSubscription: any
  sideNavBarOpened = true
  public screenSizeIsLtMedium = false
  sticky = false
  searchText = ''

  mode$ = this.isLtMedium$.pipe(map((isMedium: any) => (isMedium ? 'over' : 'side')))

  allResources!: NSKnowledgeResource.IResourceData[]

  constructor(
    private valueSvc: ValueService,
    private kwResources: KnowledgeResourceService,
    private activateRoute: ActivatedRoute
    ) {

      this.allResources = _.get(this.activateRoute.snapshot, 'data.allResources.data.responseData') || []
     }

  ngOnInit() {
    this.defaultSideNavBarOpenedSubscription = this.isLtMedium$.subscribe(isLtMedium => {
      this.sideNavBarOpened = !isLtMedium
      this.screenSizeIsLtMedium = isLtMedium
    })
  }

  ngOnDestroy() {
    if (this.defaultSideNavBarOpenedSubscription) {
      this.defaultSideNavBarOpenedSubscription.unsubscribe()
    }

  }

  refresh() {
        this.kwResources.getAllResources().subscribe((reponse: NSKnowledgeResource.IResourceResponse) => {
      if (reponse.statusInfo && reponse.statusInfo.statusCode === 200) {
        this.allResources = reponse.responseData
      }
    })
  }
}
