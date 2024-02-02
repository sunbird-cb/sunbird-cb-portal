import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormControl } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { distinctUntilChanged } from 'rxjs/operators'

@Component({
  selector: 'ws-cbp-plan-feed',
  templateUrl: './cbp-plan-feed.component.html',
  styleUrls: ['./cbp-plan-feed.component.scss'],
})
export class CbpPlanFeedComponent implements OnInit {

  searchControl = new FormControl('')
  toggleFilter = false
  contentDataList: any = []
  cbpConfig: any
  @Input()
  contenFeedList: any
  @Input()
  filterObject: any
  @Input() filterApplied = false
  @Output() toggleFilterEvent = new EventEmitter()
  @Output() searchRequest = new EventEmitter()
  @Output() closeFilterKey = new EventEmitter()

  filterValuesBinding: any = {
    status: {
      0: 'Not started',
      1: 'In progress',
      2: 'Completed',
    },
    timeDuration: {
      '7ad': 'Upcoming 7 Days',
      '30ad': 'Upcoming 30 Days',
      '90ad': 'Upcoming 3 Months',
      '182ad': 'Upcoming 6 Months',
      '1sw': 'Last week',
      '1sm': 'Last month',
      '3sm': 'Last 3 month',
      '6sm': 'Last 6 month',
      '12sm': 'Last year',
    },
  }

  constructor(
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    if (this.activatedRoute.snapshot.data.pageData) {
      this.cbpConfig = this.activatedRoute.snapshot.data.pageData.data
    }
    this.searchControl.valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe(() => {
      this.emitSearchEvent()
    })
  }

  emitSearchEvent() {
    this.searchRequest.emit({ query: this.searchControl.value })
  }

  openFilter() {
      this.toggleFilter = true
      this.toggleFilterEvent.emit(this.toggleFilter)
  }
  CloseFilter(value: any, key: any) {
    this.closeFilterKey.emit({ value, key })
  }
}
