import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material'
import { MultilingualTranslationsService } from '@sunbird-cb/utils/src/public-api'

@Component({
  selector: 'ws-widget-attendance-helper',
  templateUrl: './attendance-helper.component.html',
  styleUrls: ['./attendance-helper.component.scss'],
})
export class AttendanceHelperComponent implements OnInit {
  helperConfig: any

  constructor(
    private langtranslations: MultilingualTranslationsService,
    public dialogRef: MatDialogRef<AttendanceHelperComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.helperConfig = this.data.helperConfig
  }

  translateLabels(label: string, type: any) {
    return this.langtranslations.translateLabelWithoutspace(label, type, '')
  }
}
