import { Component, OnInit } from '@angular/core'
import { NSKnowledgeResource } from '../../models/knowledge-resource.models'
import { ActivatedRoute } from '@angular/router'
import { KnowledgeResourceService } from '../../services/knowledge-resource.service'
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'

// tslint:disable
import _ from 'lodash'
// tslint:enable

@Component({
  selector: 'ws-app-knowledge-detail',
  templateUrl: './knowledge-detail.component.html',
  styleUrls: ['./knowledge-detail.component.scss'],
  // tslint:disable-next-line
  host: { class: 'flex flex-1 overflow-hidden' },
})
export class KnowledgeDetailComponent implements OnInit {
  resource!: any
  type = 'KNOWLEDGERESOURCE'
  id = '/'
  searchText = ''
  fileType!: string
  acc: any
  obj: any

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

  updateResource(resource: NSKnowledgeResource.IResourceData) {
    resource.bookmark = true
    this.kwResources.addBookmark(resource).subscribe(data => {
      if (data) {
        this.refresh()
      }
    })
}

getSafeUrl(url: string): SafeUrl | null {
  if (url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url)
  }
  return null
}

addBookmark(resource: NSKnowledgeResource.IResourceData) {
  resource.bookmark = !resource.bookmark
  this.kwResources.addBookmark(resource).subscribe(data => {
    if (data) {
      this.refresh()
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

  getFormathours(time: number) {
    let totalHours
    let totalMinutes
    let totalSeconds
    let hours
    let minutes
    let result = ''
    totalSeconds = time / 1000
    totalMinutes = totalSeconds / 60
    totalHours = totalMinutes / 60

    // seconds = Math.floor(totalSeconds) % 60;
    minutes = Math.floor(totalMinutes) % 60
    hours = Math.floor(totalHours) % 60
    if (hours !== 0) {
        result += `${hours}hr`

        if (minutes.toString().length === 1) {
            minutes = `0${minutes}`
        }
    }
    result += `${minutes}min`
    return result
}

 getNbOccur(fileType: string, objectArray: NSKnowledgeResource.IKrFiles[]) {
  let occurs = 0
  for (let i = 0; i < objectArray.length; i += 1) {
    if (objectArray[i] && objectArray[i].fileType === fileType) {
        occurs += 1
      }
    }
  return occurs
 }

 itemCount(items: NSKnowledgeResource.IUrl[]) {
  let occurs = 0
  for (let i = 0; i < items.length; i += 1) {
    if (items[i].toString() !== '[]') {
        occurs += 1
      }
    }
  return occurs
 }

   /* To copy Text from Textbox */
  copyInputMessage(value: string): void {
    navigator.clipboard.writeText(value).then(() => {
      alert('Copied!')
    },                                        () => {
      alert('Not copied!')
    })
  }

}
