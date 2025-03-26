import { Component, OnInit } from '@angular/core'
import { MatDialogRef } from '@angular/material'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'ws-terms-and-condition',
  templateUrl: './terms-and-condition.component.html',
  styleUrls: ['./terms-and-condition.component.scss'],
})
export class TermsAndConditionComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<TermsAndConditionComponent>,
    private translate: TranslateService
  ) {
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
  }

  ngOnInit() {
  }
  closeDialog() {
    this.dialogRef.close(true)
  }

}
