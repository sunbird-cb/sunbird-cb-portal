import { Component, Input, OnInit } from '@angular/core'
import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

@Component({
  selector: 'ws-cbp-plan-stats',
  templateUrl: './cbp-plan-stats.component.html',
  styleUrls: ['./cbp-plan-stats.component.scss'],
})
export class CbpPlanStatsComponent implements OnInit {
  filterList: any = [{ id: 3, value: 'Last 3 months' }, { id: 6, value: 'Last 6 months' }, { id: 12, value: 'Last year' }]
  filterLoaded = false

  @Input() cbpCount: any
  @Input() cbpLoader: any
  @Input() cbpOriginalData: any

  dataChange: any = false

  constructor() { }

  ngOnInit() {
  }

  onfilterChange(filterData: any) {
    this.filterLoaded = true
    this.cbpLoader = true
    const filteredValue = this.cbpOriginalData.filter((data: any) => {
      // tslint:disable-next-line:max-line-length
      return dayjs(data.endDate).isSameOrAfter(dayjs(dayjs().subtract(filterData.id, 'month'))) && dayjs(data.endDate).isSameOrBefore(dayjs())
    })
    const overDueList = []
    const upcommingList: any = []
    filteredValue.forEach((ele: any) => {
      if (ele.planDuration === 'overdue') {
        overDueList.push(ele)
      } else {
        upcommingList.push(ele)
      }
    })
    this.cbpCount = {
      upcoming: upcommingList.length,
      overdue: overDueList.length,
      all: upcommingList.length + overDueList.length,
    }
    // this.timePeriodFilter.emit(data)
    // tslint:disable-next-line: whitespace
    this.cbpLoader = false
  }

}
