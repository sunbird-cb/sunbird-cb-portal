import { Component, Inject, OnInit } from '@angular/core'
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog'
import { IDialogData } from '../dialog-box-admin/dialog-box-admin.component'

@Component({
  selector: 'ws-app-dialog-box-admin-accept',
  templateUrl: './dialog-box-admin-accept.component.html',
  styleUrls: ['./dialog-box-admin-accept.component.scss'],
})
export class DialogBoxAdminAcceptComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogBoxAdminAcceptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogData) { }

  onNoClick(): void {
    this.dialogRef.close()
  }

  ngOnInit() {
  }

}
