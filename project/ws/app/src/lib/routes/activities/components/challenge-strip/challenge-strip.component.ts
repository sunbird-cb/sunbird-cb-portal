import { Component, OnInit, Input } from '@angular/core'
import { IActivityCard, IChallenges } from '../../interfaces/activities.model'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { Router } from '@angular/router'

@Component({
  selector: 'ws-app-challenge-strip',
  templateUrl: './challenge-strip.component.html',
  styleUrls: ['./challenge-strip.component.scss'],
})
export class ChallengeStripComponent implements OnInit {
  @Input() widgetData!: IChallenges
  activityCards: IActivityCard[] = []
  completedActivity: string[] = []
  completedId = false
  showActivities = true
  isActivities = true
  tag = ''

  constructor(
    private configSvc: ConfigurationsService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    if (this.configSvc.restrictedFeatures) {
      if (this.configSvc.restrictedFeatures.has('activities')) {
        this.showActivities = false
      }
    }
  }

  ngOnInit() {
    this.activityCards = this.widgetData.activities
  }

  proceedToActivity(id: string, url: string, tag: string) {
    if (this.completedActivity.indexOf(id) === -1) {
      if (tag === 'KF') {
        this.completedActivity.push(id)
        this.configSvc.completedActivity = this.completedActivity
        this.configSvc.prefChangeNotifier.next({ completedActivity: this.configSvc.completedActivity })
        this.router.navigateByUrl(url)
      } else {
        this.router.navigateByUrl(url)
      }
    } else {
      this.openSnackBar()
      this.router.navigateByUrl(url)
    }

  }
  openSnackBar() {
    this.snackBar.open('This activity is already completed', 'X', {
      duration: 2000,
    })
  }

}
