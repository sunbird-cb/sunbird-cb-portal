import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { WidgetContentService } from '@sunbird-cb/collection/src/lib/_services/widget-content.service'
import { ConfigurationsService } from '@sunbird-cb/utils'

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
    this.contentSvc.getKarmaPoitns().subscribe((res: any) => {
      if (res && res.kpList) {
        this.karmaPointsHistory = res.kpList
      }
    })

  }

  getName(row: any) {
    const info = JSON.parse(row.addinfo)
    return info.COURSENAME ? info.COURSENAME : "No course"
  }

  getAdditonInfo(row: any) {
    const info = JSON.parse(row.addinfo)
    console.log("info ", info)
    return info.ACBP
  }

}
