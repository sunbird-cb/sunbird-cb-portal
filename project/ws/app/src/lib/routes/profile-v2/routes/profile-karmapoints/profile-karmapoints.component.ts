import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { WidgetContentService } from '@sunbird-cb/collection/src/lib/_services/widget-content.service'
import { ConfigurationsService } from '@sunbird-cb/utils'
import moment from 'moment'

@Component({
  selector: 'app-profile-karmapoints',
  templateUrl: './profile-karmapoints.component.html',
  styleUrls: ['./profile-karmapoints.component.scss'],
  /* tslint:disable */
  host: { class: 'flex flex-1 margin-top-l' },
  /* tslint:enable */
})
export class ProfileKarmapointsComponent implements OnInit {
  currentUser: any
  karmaPointsHistory: any = []
  kpTooltiptext = 'Karma Points are a reward for high learning engagement at iGOT. For more information, visit Karma Points FAQs.'
  total = 0
  count = 0
  lastDate: any = moment(new Date()).valueOf()

  constructor(
    private configSvc: ConfigurationsService,
    public router: Router,
    private contentSvc: WidgetContentService,
  ) {
    this.currentUser = this.configSvc && this.configSvc.userProfile
    // this.karmaPointsHistory = [
    //   {
    //     name: 'Course Completed',
    //     courseName: 'Practise Test: Introduction to Angular',
    //     date: '19 Dec 2021',
    //     points: 10,
    //     bonus: 0,
    //   },
    //   {
    //     name: 'Course Rating',
    //     courseName: 'Practise Test: Introduction to Angular',
    //     date: '01 Apr 2001',
    //     points: 10,
    //     bonus: 0,
    //   },
    //   {
    //     name: 'Course Completed',
    //     courseName: 'Practise Test: Introduction to RxJS',
    //     date: '21 Nov 2024',
    //     points: 15,
    //     bonus: 5,
    //   },
    // ]
  }

  ngOnInit() {
    this.getKarmaPoints()
  }

  getKarmaPoints() {
    this.contentSvc.getKarmaPoitns(1, this.lastDate).subscribe((res: any) => {
      if (res && res.kpList) {
        console.log("result ", res.kpList)
        console.log("total ", res.count)
        console.log("count ", res.total + res.total.length)

        this.karmaPointsHistory = [...this.karmaPointsHistory, ...res.kpList]
        this.total = res.count
        this.count = res.total + res.total.length
        let lastRecord = res.kpList[res.kpList.length - 1]
        console.log("lastRecord ", lastRecord)
        this.lastDate = moment(lastRecord.credit_date).valueOf()
        console.log(" lastDate ", this.lastDate)
      }
    })
  }

  loadMore(){
    this.getKarmaPoints()
  }

  getName(row: any) {
    const info = JSON.parse(row.addinfo)
    return info.COURSENAME ? info.COURSENAME : 'No course'
  }

  getAdditonInfo(row: any) {
    const info = JSON.parse(row.addinfo)
    return info.ACBP
  }

}
