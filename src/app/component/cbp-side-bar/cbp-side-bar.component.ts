import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'

@Component({
  selector: 'ws-cbp-side-bar',
  templateUrl: './cbp-side-bar.component.html',
  styleUrls: ['./cbp-side-bar.component.scss'],
})
export class CbpSideBarComponent implements OnInit {

  @Input() cbpCount: any
  @Input() upcommingList: any
  @Input() overDueList: any
  @Input() cbpLoader: any
  @Input() cbpOriginalData: any
  @Output()
  filterValueEmit = new EventEmitter()

  constructor() { }

  ngOnInit() {
  }
  filterValueEmitMethod(event: any) {
    this.filterValueEmit.emit(event)
  }
}
