import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'

@Component({
  selector: 'ws-app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.scss'],
})
export class DialogBoxComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { view: string },
    public dialogRef: MatDialogRef<DialogBoxComponent>
  ) { }

  dialogClose(): void {
    this.dialogRef.close()
    }

  ngOnInit() {

  }

}
