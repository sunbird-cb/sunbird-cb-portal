import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core'
import { KnowledgeResourceService } from '../../services/knowledge-resource.service'
import { NSKnowledgeResource } from '../../models/knowledge-resource.models'
// import {  Router } from '@angular/router';

@Component({
  selector: 'ws-app-knowledge-card',
  templateUrl: './knowledge-card.component.html',
  styleUrls: ['./knowledge-card.component.scss'],
  // tslint:disable-next-line
  host: { class: 'flex flex-1 knowledge_card_full w-full' },
})
export class KnowledgeCardComponent implements OnInit {

  @Input() resource!: any
  @Output() resourceBookmarkEvent = new EventEmitter<NSKnowledgeResource.IResourceData>()
  time:number | undefined

  constructor(
    private kwResources: KnowledgeResourceService,

    ) {

  }

  ngOnInit() {
  }

  addBookmark(resource: NSKnowledgeResource.IResourceData) {
    resource.bookmark = !resource.bookmark
    this.kwResources.addBookmark(resource).subscribe(data => {
      if (data) {
        this.resourceBookmarkEvent.emit()
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

//  getFormathours(time: number) {
//   var h = Math.floor(time / 3600);
//   var m = Math.floor(time % 3600 / 60);
//   // var s = Math.floor(d % 3600 % 60);

//   var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
//   var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
//   // var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
//   console.log(hDisplay + mDisplay)
//   return hDisplay + mDisplay

// }

}
