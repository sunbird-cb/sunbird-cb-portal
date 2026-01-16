import { Component, Inject, OnInit } from '@angular/core'
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'

@Component({
  selector: 'ws-app-dialog-assign',
  templateUrl: './dialog-assign.component.html',
  styleUrls: ['./dialog-assign.component.scss'],
})
export class DialogAssignComponent implements OnInit {
  isMandatory = false
  usersCount = 0
  contentsCount = 0
  constructor(
    public dialogRef: MatDialogRef<DialogAssignComponent>,
    public configSvc: ConfigurationsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.isMandatory = this.data.isMandatory
    this.usersCount = this.data.usersCount
    this.contentsCount = this.data.contentsCount
  }

  close(confirm = false): void {
    this.dialogRef.close({
      confirm,
      isMandatory: this.isMandatory
      ,
    })
  }
}
