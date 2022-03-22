import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core'
import { KnowledgeResourceService } from '../../services/knowledge-resource.service'
import { NSKnowledgeResource } from '../../models/knowledge-resource.models'
// import { compact } from 'lodash'
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

itemCount(items: NSKnowledgeResource.IUrl[]) {
  let occurs = 0
  for (let i = 0; i < items.length; i += 1) {
    if (items[i].toString() !== '[]') {
        occurs += 1
      }
    }
  return occurs
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
}
