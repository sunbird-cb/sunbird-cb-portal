import { Component, OnInit } from '@angular/core'
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog'
import { Router } from '@angular/router'

@Component({
  selector: 'ws-signup-success-dialogue',
  templateUrl: './signup-success-dialogue.component.html',
  styleUrls: ['./signup-success-dialogue.component.scss'],
})
export class SignupSuccessDialogueComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<SignupSuccessDialogueComponent>,
    private router: Router
  ) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close()
    this.router.navigate(['/static-home'])
  }

}
