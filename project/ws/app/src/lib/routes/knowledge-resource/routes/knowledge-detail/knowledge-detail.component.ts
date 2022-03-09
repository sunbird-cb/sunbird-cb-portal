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
  host: { class: 'flex flex-1 knowledge_box_full' },
})
export class KnowledgeDetailComponent implements OnInit {
  resource!: any
  type = 'KNOWLEDGERESOURCE'
  id = '/'
  searchText = ''
  fileType!:string
  acc:any
  obj:any

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

    // const count = array.reduce((acc, cur:any) => cur.fileType === id ? ++acc : acc, 0);
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
    var totalHours, totalMinutes, totalSeconds, hours, minutes, result='';
    totalSeconds = time / 1000;
    totalMinutes = totalSeconds / 60;
    totalHours = totalMinutes / 60;

    // seconds = Math.floor(totalSeconds) % 60;
    minutes = Math.floor(totalMinutes) % 60;
    hours = Math.floor(totalHours) % 60;
    if (hours !== 0) {
        result += hours+' hr';

        if (minutes.toString().length == 1) {
            minutes = '0'+minutes;
        }
    }

    result += minutes+' min';
    return result;
}

// groupBy(objectArray:any, property:any) {
//   return Array.isArray(objectArray) ? objectArray.reduce((acc:any, obj:any) => {
//      const key = obj[property];
//      if (!acc[key]) {
//         acc[key] = [];
//      }
//      // Add object to list for given key's value
//      acc[key].push(obj);
//      console.log(acc);
//      return acc;
//   },
//    {}) : {}
// }

 getNbOccur(fileType:string, objectArray:NSKnowledgeResource.IKrFiles[]) {
  var occurs = 0;
  console.log('objectArray[i].fileType is ' + JSON.stringify(objectArray))
  for (var i=0; i<objectArray.length; i++) {

    if ( objectArray[i] && objectArray[i].fileType === fileType ) {

      occurs+=1
      console.log('occurs is ' + occurs)
    }
    }
    return occurs

 }

}
