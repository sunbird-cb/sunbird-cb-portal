import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { Router } from '@angular/router'
import { ConfigurationsService, NsPage } from '@sunbird-cb/utils-v2'
import {
  mapFilePath,
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

  mapPath = mapFilePath

  currentDashboard: any = []

  // API endpoints needs to be passed here
  getDashboardForKM = '/apis/proxies/v8/dashboard/analytics/getDashboardConfig/Karmayogi'
  getDashboardForProfile = '/apis/proxies/v8/dashboard/analytics/getDashboardsForProfile/Karmayogi?realm=igot'
  getChartV2 = '/apis/proxies/v8/dashboard/analytics/getChartV2/Karmayogi'

  dashboardEmpty = dashboardEmptyData

  ngOnInit() {
    if (this.selectedDashboardId === '') {
      this.currentDashboard = []
      this.currentDashboard.push(this.dashboardEmpty)
    }
  }

  getDashboardId(value: string) {
    if (value && value !== null) {
      this.selectedDashboardId = value
    } else {
      this.currentDashboard = []
      this.currentDashboard.push(this.dashboardEmpty)
    }
  }

  backToHome() {
    this.router.navigate(['page', 'home'])
  }

}
