import { Component, OnInit } from '@angular/core'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { BtnGoalsService, NsGoal } from '@sunbird-cb/collection'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'ws-app-goal-track',
  templateUrl: './goal-track.component.html',
  styleUrls: ['./goal-track.component.scss'],
})
export class GoalTrackComponent implements OnInit {
  goal: NsGoal.IGoal | undefined = undefined

  constructor(
    private route: ActivatedRoute,
    private goalsSvc: BtnGoalsService,
    public configSvc: ConfigurationsService,
  ) {}

  ngOnInit() {
    const goalId = this.route.snapshot.params.goalId
    this.goal = this.goalsSvc.goalsHash[goalId]
    if (!this.goal) {
      this.goalsSvc.getOthersGoals('isInIntranet').subscribe(goals => {
        this.goal = goals.find(goal => goal.id === goalId)
      })
    }
  }
}
