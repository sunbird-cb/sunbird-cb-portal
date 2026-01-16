import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core'
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { NsGoal, BtnGoalsService } from '@sunbird-cb/collection'
import { TFetchStatus } from '@sunbird-cb/utils-v2'

@Component({
  selector: 'ws-app-goal-reject-dialog',
  templateUrl: './goal-reject-dialog.component.html',
  styleUrls: ['./goal-reject-dialog.component.scss'],
})
export class GoalRejectDialogComponent implements OnInit {
  @ViewChild('errorReject', { static: true }) errorRejectMessage!: ElementRef<
    any
  >
  @ViewChild('successReject', { static: true })
  successRejectMessage!: ElementRef<any>

  rejectMessage: string | null = null
  rejectGoalStatus: TFetchStatus = 'none'

  constructor(
    private snackbar: MatSnackBar,
    private goalSvc: BtnGoalsService,
    private dialogRef: MatDialogRef<GoalRejectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public goal: NsGoal.IGoal,
  ) {}

  ngOnInit() {}

  rejectGoal() {
    if (this.goal && this.rejectMessage && this.rejectMessage.length) {
      this.rejectGoalStatus = 'fetching'
      this.goalSvc
        .acceptRejectGoal(
          'reject',
          this.goal.type,
          this.goal.id,
          this.goal.sharedBy ? this.goal.sharedBy.userId : '',
          this.rejectMessage,
        )
        .subscribe(
          () => {
            this.rejectGoalStatus = 'done'
            this.snackbar.open(this.successRejectMessage.nativeElement.value)
            this.dialogRef.close(true)
          },
          () => {
            this.rejectGoalStatus = 'error'
            this.snackbar.open(this.errorRejectMessage.nativeElement.value)
          },
        )
    }
  }
}
