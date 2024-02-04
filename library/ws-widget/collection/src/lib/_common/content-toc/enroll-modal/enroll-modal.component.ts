import { Component, OnInit, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'ws-widget-enroll-modal',
  templateUrl: './enroll-modal.component.html',
  styleUrls: ['./enroll-modal.component.scss'],
})

export class EnrollModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<EnrollModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {

  }

  handleCloseModal(): void {
    this.dialogRef.close()
  }

}
