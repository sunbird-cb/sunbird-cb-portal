import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { achievement } from '../../../models/profile-revamp.model';
import { MAT_LEGACY_DIALOG_DATA, MatLegacyDialog, MatLegacyDialogRef } from '@angular/material/legacy-dialog';
import { ProfileV2RevampService } from '../../../services/profile-v2-revamp.service';
import { MatLegacySnackBar } from '@angular/material/legacy-snack-bar';
import * as _ from 'lodash';
import { CertificateViewPopupComponent } from '../certificate-view-popup/certificate-view-popup.component';

@Component({
  selector: 'ws-app-achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.scss']
})
export class AchievementsComponent implements OnInit {
  //#region (global variables)
  @Input() achievementsList: achievement[] = [];
  @Input() isCurrentUser = false;
  @Output() openProfileEntryEditDialog = new EventEmitter();
  @Output() openProfileEntryDeleteDialog = new EventEmitter();

  userId: string = '';
  isPopup: boolean = false;
  //#endregion
  constructor(
    private dialogRef: MatLegacyDialogRef<AchievementsComponent>,
    @Inject(MAT_LEGACY_DIALOG_DATA) private data: any,
    private profileV2RevampSvc: ProfileV2RevampService,
    private snackBar: MatLegacySnackBar,
    private dialog: MatLegacyDialog,
    private cdr: ChangeDetectorRef
  ) {
    if (this.data && this.data.userId) {
      this.userId = data.userId;
      this.isPopup = true
      this.isCurrentUser = data.isCurrentUser || false;
    }
  }

  ngOnInit() {
    if (this.isPopup) {
      this.getAchievementsList();
    } else {
      this.cdr.detectChanges()
    }
  }

  //#region (functions)

  getAchievementsList(userId?:any): void {
    if (this.userId || userId) {
      this.profileV2RevampSvc.fetchProfileEntries(this.userId || userId, 'achievement').subscribe({
        next: (res: any) => {
          if (res) {
            this.achievementsList = _.get(res, 'result.response.achievements', []);
            this.cdr.detectChanges()
          }
        },
        error: (err: any) => {
          if (err) {
            this.openSnackbar('Something went wrong while fetching achievements, please try again later', 2000);
          }
        }
      })
    }
  }

  openEditDialog(entry: any = {}): void {
    if(this.isPopup) { 
      this.dialogRef.close(entry);
    } else {
      this.openProfileEntryEditDialog.emit(entry);
    }
  }

  viewMore(achievement: any): void {
    if (achievement && achievement.showMore) {
      achievement.showMore = false;
    } else {
      achievement['showMore'] = true;
    }
  }

  openDocument(url: string): void {
    if (url) {
      this.dialog.open(CertificateViewPopupComponent, {
        width: '600px',
        panelClass: 'cover-photo-edit-popup',
        data: {
          certificateUrl: url
        },
        disableClose: true,
        autoFocus: false,
      })
    }
  }

  openUrl(url: string): void {
    window.open(url, '_blank');
  }

  closePopup(): void {
    if(this.isPopup) {
      this.dialogRef.close();
    }
  }

  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }
  //#endregion (functions)
  deleteAchievement(achievement: achievement): void {
    if(this.isPopup) { 
      this.dialogRef.close({achievement, action: 'delete'});
    } else {
      this.openProfileEntryDeleteDialog.emit(achievement);
    }
  }
}
