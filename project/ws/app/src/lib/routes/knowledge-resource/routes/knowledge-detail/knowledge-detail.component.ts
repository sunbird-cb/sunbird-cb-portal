import { Component, OnInit } from '@angular/core';
// import { AccessControlService } from '@ws/author/src/lib/modules/shared/services/access-control.service'
// import { Input } from 'hammerjs';
// import { KnowledgeResourceService } from "../../services/knowledge-resource.service"
import { NSKnowledgeResource } from "../../models/knowledge-resource.models";
import { ActivatedRoute } from '@angular/router';
import { KnowledgeResourceService } from '../../services/knowledge-resource.service';
import _ from 'lodash';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


@Component({
  selector: 'ws-app-knowledge-detail',
  templateUrl: './knowledge-detail.component.html',
  styleUrls: ['./knowledge-detail.component.scss'],
  host: { class: 'flex flex-1 knowledge_box_full' },
})
export class KnowledgeDetailComponent implements OnInit {
  resource!: any
  type:string = 'KNOWLEDGERESOURCE'
  id: string = '/'

  constructor(
    private route: ActivatedRoute,
    private kwResources: KnowledgeResourceService,
    private sanitizer: DomSanitizer
    ) {
      // this.resource = _.get(this.route.snapshot, 'data.resource.data.responseData') || []
   }


  ngOnInit() {
    this.route.params.subscribe(async params => {
      this.id = _.get(params, 'id')
      this.type = _.get(params, 'type')

    })
    this.kwResources
    .getResource(this.id, this.type)
    .subscribe((reponse: NSKnowledgeResource.IResourceResponse) => {
      if (reponse.statusInfo && reponse.statusInfo.statusCode === 200) {
        this.resource = reponse.responseData
      } else {
        this.resource = []
      }
    })
  }

  updateResource(resource:NSKnowledgeResource.IResourceData) {
    resource.bookmark = true
    this.kwResources.addBookmark(resource).subscribe(data => {
      if (data) {
        this.refresh()
      }
    })
}

getSafeUrl(url:string):SafeUrl | null {
  if(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url)
  }
  return null
}

addBookmark(resource: NSKnowledgeResource.IResourceData) {
  resource.bookmark = !resource.bookmark
  this.kwResources.addBookmark(resource).subscribe(data => {
    if (data) {
      this.refresh();
    }
  })
}

refresh() {
  this.kwResources.getAllResources().subscribe((reponse: NSKnowledgeResource.IResourceResponse) => {
    if (reponse.statusInfo && reponse.statusInfo.statusCode === 200) {
      this.resource = reponse.responseData
      }
    })
  }
}
