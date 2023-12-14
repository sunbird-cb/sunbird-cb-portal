import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import {  } from 'stream'

@Component({
  selector: 'ws-app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
  @Output() toggleFilter = new EventEmitter()
  constructor() { }

  ngOnInit() {
  }

  hideFilter() {
    this.toggleFilter.emit(false)
  }
}
