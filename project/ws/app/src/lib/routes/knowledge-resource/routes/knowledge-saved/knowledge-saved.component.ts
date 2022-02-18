import { Component, OnInit } from '@angular/core';
// import { KnowledgeResourceService } from '../../services/knowledge-resource.service';
import { NSKnowledgeResource } from '../../models/knowledge-resource.models';
/** tslint:disable */
import _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { KnowledgeResourceService } from '../../services/knowledge-resource.service';
/* tslint:enable */

@Component({
  selector: 'ws-app-knowledge-saved',
  templateUrl: './knowledge-saved.component.html',
  styleUrls: ['./knowledge-saved.component.scss'],
  host: { class: 'flex flex-1 margin-top-xl competency_main_block' },
})
export class KnowledgeSavedComponent implements OnInit {
  allResources!:NSKnowledgeResource.IResourceData[]
  // kwResources: any;
  constructor( private activateRoute: ActivatedRoute,
    private kwResources: KnowledgeResourceService
    ) {
      this.filterSaved(null)
  }

  ngOnInit() {


  }

  filterSaved(data:NSKnowledgeResource.IResourceData[] | null) {
    if(data != null)  {
      this.allResources = _.filter(data, {bookmark:true}) || []

    }
     else {
      this.allResources = _.filter(_.get(this.activateRoute.snapshot, 'data.allSavedResources.data.responseData'), {bookmark:true}) || []
  }
}

  refresh() {
    this.kwResources.getBookmarkedResource().subscribe((reponse: NSKnowledgeResource.IResourceResponse) => {
      if (reponse.statusInfo && reponse.statusInfo.statusCode === 200) {

        this.filterSaved(reponse.responseData)
      }
    })
}

}
