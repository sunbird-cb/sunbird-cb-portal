import { Component, Input, OnInit } from '@angular/core'
import { SocialForum } from '../../../models/SocialForumposts.model'
import { DialogBoxModeratorComponent } from '../../Dialog-Box/dialog-box-moderator/dialog-box-moderator.component'
import { BtnFlagService } from './btn-flag.service'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'

@Component({
  selector: 'ws-app-btn-flag',
  templateUrl: './btn-flag.component.html',
  styleUrls: ['./btn-flag.component.scss'],
})
export class BtnFlagComponent implements OnInit {
  @Input() postId = ''
  @Input() flagged = false
  @Input() postCreatorId = ''
  flaggedReason = ''
  isUpdating = false
  showFlag = false
  userId = ''
  flagEnabled = false
  types: 'EMPTYFLAG' | 'FILLEDFLAG' | 'PENDING' = 'PENDING'
  flagRequest: SocialForum.IFlagRequest = {
    id: '',
    activityType: SocialForum.EUserActivity.FLAG,
    userComment: {
      commentType: SocialForum.EModeratorReactComment.PREDEFINED,
      comment: '',
    },
  }
  unflagRequest: SocialForum.IFlagRequest = {
    id: '',
    activityType: SocialForum.EUserActivity.FLAG,

  }
  constructor(private flagsvc: BtnFlagService, private snackBar: MatSnackBar, private configSvc: ConfigurationsService,
              public dialog: MatDialog
  ) {

    if (this.configSvc.userProfile) {
      this.userId = this.configSvc.userProfile.userId || ''
    }
  }

  ngOnInit() {
    if (this.configSvc.restrictedFeatures && !(this.configSvc.restrictedFeatures.has('flagEnabled'))) {
      this.flagEnabled = true
    }
    if (this.flagged) {
      this.types = 'FILLEDFLAG'
    } else {
      this.types = 'EMPTYFLAG'
    }
  }

  openDialog(invalidUserMsg: string): void {
    if (this.postCreatorId === this.userId) {
      this.snackBar.open(invalidUserMsg, 'X')
      return
    }
    const dialogRef = this.dialog.open(DialogBoxModeratorComponent, { data: this.postId })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.types = 'FILLEDFLAG'

      } else {
        this.types = 'EMPTYFLAG'
      }
    })
  }

  unflag() {
    this.types = 'PENDING'
    this.unflagRequest.id = this.postId
    this.flagsvc.unflagPost(this.unflagRequest).subscribe(() => {

      this.types = 'EMPTYFLAG'
      // console.log("THE TYPESSS HAS BEEEN CHANGED TO in UNFLAG" + this.typesss)

    },                                                    () => {
    })
  }
}
