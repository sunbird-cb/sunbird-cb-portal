import { Component, Inject, OnInit } from '@angular/core'
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog'

export interface IDialogData {

  reasonOfRevival: string
}
@Component({
  selector: 'ws-app-dialog-box-admin',
  templateUrl: './dialog-box-admin.component.html',
  styleUrls: ['./dialog-box-admin.component.scss'],
})
export class DialogBoxAdminComponent implements OnInit {
  reasonOfRevival: String = ''

  constructor(
    public dialogRef: MatDialogRef<DialogBoxAdminComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogData) { }

  ngOnInit() {

  }

  onNoClick(): void {
    this.dialogRef.close()
  }
}
