import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { DomSanitizer,} from '@angular/platform-browser';

@Component({
  selector: 'ws-widget-certificate-dialog',
  templateUrl: './certificate-dialog.component.html',
  styleUrls: ['./certificate-dialog.component.scss']
})
export class CertificateDialogComponent implements OnInit {

  url!: string;
  constructor(public dialogRef: MatDialogRef<CertificateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer) {

  }

  ngOnInit() {
    this.url = this.data.cet
  }

  dwonloadCert(){
    const a: any = document.createElement('a');
    a.href = this.data.cet;
    a.download = 'çertificate';
    document.body.appendChild(a);
    a.style = 'display: none';
    a.click();
    a.remove();
  }
}
