import { Component, OnInit } from '@angular/core'
import { MatDialogRef } from '@angular/material'

@Component({
  selector: 'ws-terms-and-condition',
  templateUrl: './terms-and-condition.component.html',
  styleUrls: ['./terms-and-condition.component.scss'],
})
export class TermsAndConditionComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<TermsAndConditionComponent>,
  ) { }

  ngOnInit() {
  }
  closeDialog() {
    this.dialogRef.close()
  }

}
