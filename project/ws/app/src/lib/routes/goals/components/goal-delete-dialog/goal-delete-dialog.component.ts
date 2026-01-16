import { Component, Inject, ViewChild, ElementRef } from '@angular/core'
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { NsGoal, BtnGoalsService } from '@sunbird-cb/collection'
import { TFetchStatus } from '@sunbird-cb/utils-v2'

@Component({
  selector: 'ws-app-goal-delete-dialog',
  templateUrl: './goal-delete-dialog.component.html',
  styleUrls: ['./goal-delete-dialog.component.scss'],
})
export class GoalDeleteDialogComponent {
  deleteGoalStatus: TFetchStatus = 'none'

  @ViewChild('errorDelete', { static: true })
  errorDeleteMessage!: ElementRef<any>
  @ViewChild('successDelete', { static: true })
  successDeleteMessage!: ElementRef<any>

  constructor(
    private dialogRef: MatDialogRef<GoalDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public goal: NsGoal.IGoal,
    private goalSvc: BtnGoalsService,
    private snackBar: MatSnackBar,
  ) { }

  deleteGoal() {
    if (this.goal) {
      this.deleteGoalStatus = 'fetching'
      this.goalSvc.deleteGoal(this.goal.type, this.goal.id).subscribe(
        () => {
          this.deleteGoalStatus = 'done'
          this.snackBar.open(this.successDeleteMessage.nativeElement.value, 'X')
          this.dialogRef.close(true)
        },
        () => {
          this.deleteGoalStatus = 'error'
          this.snackBar.open(this.errorDeleteMessage.nativeElement.value, 'X')
        },
      )
    }
  }
}
