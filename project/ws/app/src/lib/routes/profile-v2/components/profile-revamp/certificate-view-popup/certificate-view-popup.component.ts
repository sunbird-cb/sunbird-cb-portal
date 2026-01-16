import { Component, Inject, OnInit } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA, MatLegacyDialogRef } from '@angular/material/legacy-dialog';

@Component({
  selector: 'ws-app-certificate-view-popup',
  templateUrl: './certificate-view-popup.component.html',
  styleUrls: ['./certificate-view-popup.component.scss']
})
export class CertificateViewPopupComponent implements OnInit{
  certificateUrl = '';

  constructor(private dialogRef: MatLegacyDialogRef<CertificateViewPopupComponent>,
      @Inject(MAT_LEGACY_DIALOG_DATA) public data: any) {
      }

  ngOnInit(): void {
    if (this.data && this.data.certificateUrl) {
      this.certificateUrl = this.data.certificateUrl;
    }
  }

  closePopup() {
    this.dialogRef.close();
  }

}
