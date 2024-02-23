import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'ws-app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.scss'],
})
export class DialogBoxComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { view: string },
    public dialogRef: MatDialogRef<DialogBoxComponent>,
    private translate: TranslateService
  ) {
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
  }

  dialogClose(): void {
    this.dialogRef.close()
    }

  ngOnInit() {

  }

}
