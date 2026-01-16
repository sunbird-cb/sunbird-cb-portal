import { Component, OnInit } from '@angular/core'
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog'

@Component({
  selector: 'ws-app-dialog-user-role-select',
  templateUrl: './dialog-user-role-select.component.html',
  styleUrls: ['./dialog-user-role-select.component.scss'],
})
export class DialogUserRoleSelectComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogUserRoleSelectComponent>,
  ) { }

  ngOnInit() {
  }

  close(userType: string): void {
    this.dialogRef.close(userType)
  }
}
