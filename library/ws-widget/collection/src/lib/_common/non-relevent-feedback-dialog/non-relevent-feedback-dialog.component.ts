import { Component } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ws-widget-non-relevent-feedback-dialog',
  templateUrl: './non-relevent-feedback-dialog.component.html',
  styleUrls: ['./non-relevent-feedback-dialog.component.scss'],
})
export class NonReleventFeedbackDialogComponent {
  constructor(
    public matDialogRef: MatDialogRef<NonReleventFeedbackDialogComponent>,
    private translate: TranslateService
  ) {
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en');
      const lang = localStorage.getItem('websiteLanguage')!;
      this.translate.use(lang);
    }
  }

  saveFeedback(comment: string) {
    this.matDialogRef.close(comment);
  }

  cancelFeedbackPopup() {
    this.matDialogRef.close();
  }
}
