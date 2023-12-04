import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'ws-widget-attendance-helper',
  templateUrl: './attendance-helper.component.html',
  styleUrls: ['./attendance-helper.component.scss'],
})
export class AttendanceHelperComponent implements OnInit {
  helperConfig: any

  constructor(
    private translate: TranslateService,
    public dialogRef: MatDialogRef<AttendanceHelperComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.helperConfig = this.data.helperConfig
  }

  translateLabels(label: string, type: any, index: any) {
    label = label.replace(/\s/g, "")
    if (index) {
      const translationKey = type + '.' +  label + index;
      return this.translate.instant(translationKey);
    }
    const translationKey = type + '.' +  label;
    return this.translate.instant(translationKey);
  }
}
