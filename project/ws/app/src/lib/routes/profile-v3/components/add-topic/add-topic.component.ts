import { Component, OnInit, Inject } from '@angular/core'
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms'
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog'
import { TranslateService } from '@ngx-translate/core'
@Component({
  selector: 'ws-app-add-topic',
  templateUrl: './add-topic.component.html',
  styleUrls: ['./add-topic.component.scss'],
})
export class AddTopicDialogComponent implements OnInit {

  createTopic!: UntypedFormGroup
  constructor(
    public dialogRef: MatDialogRef<AddTopicDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translate: TranslateService
  ) {

    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }

  }

  close(): void {
    this.dialogRef.close()
  }

  create(): void {
    if (this.createTopic.get('topicName')) {
      const val = this.createTopic.value
      if (val && val.topicName) {
        this.dialogRef.close(val.topicName)
      }
    }

  }

  ngOnInit() {
    this.createTopic = new UntypedFormGroup(
      {
        topicName: new UntypedFormControl(null, [Validators.required]),
      })
  }
  cancel() {
    this.close()
  }
}
