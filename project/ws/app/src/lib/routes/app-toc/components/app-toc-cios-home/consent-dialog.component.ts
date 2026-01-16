import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'ws-app-consent-dialog',
  template: `
    <div class="consent-dialog-wrapper">
      <div *ngIf="loading" class="loading-container">
        <p>Loading content...</p>
      </div>
      <div *ngIf="!loading" class="consent-content" [innerHTML]="htmlContent"></div>
      <div class="consent-buttons" >
        <button class="btn-disagree" (click)="onClose()">I Do Not Agree</button>
        <button class="btn-agree" (click)="onAccept()">I Agree</button>
      </div>
    </div>
  `,
  styles: [`
    .consent-dialog-wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      padding: 0;
      margin: 0;
      background: white;
    }

    .loading-container {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      background: white;
    }

    .consent-content {
      width: 100%;
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      background: white;
    }

    .consent-buttons {
      display: flex;
      gap: 12px;
      padding: 20px;
      background: white;
      border-top: 1px solid #e0e0e0;
      justify-content: center;
      align-items: center;
    }

    .btn-disagree {
      padding: 10px 24px;
      border: 2px solid #1B4CA1;
      background: white;
      color: #1B4CA1;
      border-radius: 4px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-disagree:hover {
      background: #f5f5f5;
    }

    .btn-agree {
      padding: 12px 24px;
      border: none;
      background: #1B4CA1;
      color: white;
      border-radius: 4px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-agree:hover {
      background: #1B4CA1;
    }
  `]
})
export class ConsentDialogComponent implements OnInit {
  htmlContent: SafeHtml = 'Loading...'
  loading = true
  error = false

  constructor(
    private dialogRef: MatDialogRef<ConsentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    if (this.data?.consentUrl) {
      this.loadConsent()
    } else {
      this.loading = false
    }
  }

  private loadConsent(): void {
    this.http.get(this.data.consentUrl, {
      responseType: 'text',
      headers: { 'Cache-Control': 'no-cache' }
    }).subscribe({
      next: (html) => {
        try {
          const parser = new DOMParser()
          const doc = parser.parseFromString(html, 'text/html')
          const bodyContent = doc.body?.innerHTML || html
          const styleContent = Array.from(doc.head?.querySelectorAll('style') || [])
            .map(s => s.outerHTML)
            .join('')
          this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(styleContent + bodyContent)
          this.loading = false
        } catch (e) {
          this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(html)
          this.loading = false
        }
      },
      error: (_err: any) => {
          // Try loading from fallback URL
          this.loadConsentFromFallback()

      }
    })
  }

  onClose(): void {
    this.dialogRef.close(false)
  }

  onAccept(): void {
    this.dialogRef.close(true)
  }

  private loadConsentFromFallback(): void {
    this.http.get(this.data.assetsDocUrl, {
      responseType: 'text',
      headers: { 'Cache-Control': 'no-cache' }
    }).subscribe({
      next: (html) => {
        try {
          const parser = new DOMParser()
          const doc = parser.parseFromString(html, 'text/html')
          const bodyContent = doc.body?.innerHTML || html
          const styleContent = Array.from(doc.head?.querySelectorAll('style') || [])
            .map(s => s.outerHTML)
            .join('')
          this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(styleContent + bodyContent)
          this.loading = false
        } catch (e) {
          this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(html)
          this.loading = false
        }
      },
      error: (_err: any) => {
        this.htmlContent = this.sanitizer.bypassSecurityTrustHtml('<p>Consent content will be loaded shortly.</p>')
        this.loading = false
        this.error = true
      }
    })
  }
}



