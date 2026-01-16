import { Component, Input, OnInit } from '@angular/core';
import { UserStats } from '../../../models/profile-revamp.model';
import { Router } from '@angular/router';

@Component({
  selector: 'ws-app-user-stats',
  templateUrl: './user-stats.component.html',
  styleUrls: ['./user-stats.component.scss']
})
export class UserStatsComponent implements OnInit {

  //#region (global variables)
  @Input() userStats: UserStats[] = [];
  @Input() isMobile = false;
  @Input() isNotMyUserAndIgotOrg = false;
  //#endregion

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  viewAll(state: UserStats) {
    if (state.vewAllUrl) {
      this.router.navigateByUrl(state.vewAllUrl);
    }
  }

}
