import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'ws-widget-attendance-helper',
  templateUrl: './attendance-helper.component.html',
  styleUrls: ['./attendance-helper.component.scss']
})
export class AttendanceHelperComponent implements OnInit {
  helperConfig:any

  constructor(
    public dialogRef: MatDialogRef<AttendanceHelperComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.helperConfig = this.data.helperConfig
  }

}
