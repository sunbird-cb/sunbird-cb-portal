import { Component, OnInit } from '@angular/core'
import { MatDialogRef } from '@angular/material'

@Component({
  selector: 'ws-signup-success-dialogue',
  templateUrl: './signup-success-dialogue.component.html',
  styleUrls: ['./signup-success-dialogue.component.scss'],
})
export class SignupSuccessDialogueComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<SignupSuccessDialogueComponent>,
  ) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close()
  }

}
