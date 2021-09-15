import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { Router } from '@angular/router'
import { ConfigurationsService, NsPage } from '@sunbird-cb/utils'
import {
  dashboardListData,
  mapFilePath,
  dashboardOneData,
  dashboardOneLastMonthData,
  dashboardTwoData,
  dashboardThreeData,
  dashboardFourData,
  dashboardFiveData,
  dashboardSixData,
  dashboardEmptyData,
} from '../../../../../../../../../src/dashboard-assets/data/data'

@Component({
  selector: 'ws-app-my-dashboard-home',
  templateUrl: './my-dashboard-home.component.html',
  styleUrls: ['./my-dashboard-home.component.scss', 'bootstrap-rain.scss'],
  /* tslint:disable-next-line */
  encapsulation: ViewEncapsulation.None,
  /* tslint:enable */
})
export class MyDashboardHomeComponent implements OnInit {

  constructor(private router: Router, private configSvc: ConfigurationsService) { }
  pageNavbar: Partial<NsPage.INavBackground> = this.configSvc.pageNavBar

  selectedDashboardId = ''

  dashboardList = dashboardListData

  mapPath = mapFilePath

  currentDashboard: any = []

  dashboardOne = dashboardOneData

  dashboardOneLastMonth = dashboardOneLastMonthData

  dashboardTwo = dashboardTwoData

  dashboardThree = dashboardThreeData

  dashboardFour = dashboardFourData

  dashboardFive = dashboardFiveData

  dashboardSix = dashboardSixData

  dashboardEmpty = dashboardEmptyData

  ngOnInit() {
    if (this.selectedDashboardId === '') {
      this.selectedDashboardId = this.dashboardList[0].responseData[0].id
      this.currentDashboard.push(this.dashboardOne)
    }
  }

  getDashboardId(value: string) {
    this.selectedDashboardId = value

    if (this.selectedDashboardId === 'workAllocation') {
      this.currentDashboard = []
      this.currentDashboard.push(this.dashboardOne)
    } else if (this.selectedDashboardId === 'cbpOverview') {
      this.currentDashboard = []
      this.currentDashboard.push(this.dashboardTwo)
    } else if (this.selectedDashboardId === 'pltEnage') {
      this.currentDashboard = []
      this.currentDashboard.push(this.dashboardThree)
    } else if (this.selectedDashboardId === 'overallStatus') {
      this.currentDashboard = []
      this.currentDashboard.push(this.dashboardFour)
    } else {
      this.currentDashboard = []
      this.currentDashboard.push(this.dashboardEmpty)
    }
  }

  backToHome() {
    this.router.navigate(['page', 'home'])
  }

}
