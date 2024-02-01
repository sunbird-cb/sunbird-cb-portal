import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'ws-discussion-info',
  templateUrl: './discussion-info.component.html',
  styleUrls: ['./discussion-info.component.scss'],
})
export class DiscussionInfoComponent implements OnInit {

  @Input() dataToBind: any
  constructor() { }

  ngOnInit() {
  }

  getBackgroundColor() {

  }

}
