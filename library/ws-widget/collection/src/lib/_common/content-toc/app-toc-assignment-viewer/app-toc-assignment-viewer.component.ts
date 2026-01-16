import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { MatLegacyDialog } from '@angular/material/legacy-dialog'
import { MatLegacySnackBar } from '@angular/material/legacy-snack-bar'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { Router } from '@angular/router'
import { ConfirmationDialogComponent } from '@sunbird-cb/consumption'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { AppTocService } from '@ws/app/src/lib/routes/app-toc/services/app-toc.service'

@Component({
  selector: 'ws-widget-app-assignment-viewer',
  templateUrl: './app-toc-assignment-viewer.component.html',
  styleUrls: ['./app-toc-assignment-viewer.component.scss'],
})

export class AssignmentViewerComponent implements OnInit {
  documentUrl = ''
  documentType = ''
  loading: boolean = true
  error: boolean = false
  errorMessage: string = ''
  safeSrc: SafeResourceUrl | null = null
  @ViewChild('docIframe') docIframe: ElementRef | undefined
  height: string = '750px'
  width: string = '80%'
  constructor(public router: Router,
    public tocSvc: AppTocService,
    public configSvc: ConfigurationsService,
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<AssignmentViewerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogLegacy: MatLegacyDialog,
    private snackBar: MatLegacySnackBar,
  ) { }

  ngOnInit() {
    // this.documentUrl = 'https://portal.dev.karmayogibharat.net/content-store/content/do_1144038388811530241163/artifact/do_1144038388811530241163_1758281114109_leave-policy_ver-4.1.docx1758281113936.pdf'
    // this.documentUrl = 'https://portal.dev.karmayogibharat.net/content-store/content/do_1144038206161797121162/artifact/do_1144038206161797121162_1758278884521_sravan.resume1758278884414.docx'
    this.documentUrl = this.data.url
    if (this.documentUrl.toLowerCase().endsWith('.pdf')) {
      this.documentType = 'pdf'
    } else if (this.documentUrl.toLowerCase().endsWith('.docx')) {
      this.documentType = 'docx'
    } else if (this.documentUrl.toLowerCase().endsWith('.doc')) {
      this.documentType = 'doc'
    }
    this.processDocumentUrl()
  }

  processDocumentUrl() {
    try {
      if (this.documentType === 'pdf') {
        const pdfUrlWithParams = this.documentUrl + '#toolbar=0&navpanes=0&scrollbar=0'
        this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrlWithParams)
      } else if (['doc', 'docx'].includes(this.documentType)) {
        setTimeout(() => {
          const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(this.documentUrl)}&embedded=true&chrome=false&disablePopouts=true&hideControls=1&nocache=${Date.now()}`
          this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(googleDocsUrl)
          console.log('Google Docs viewer URL:', googleDocsUrl)
        }, 1000)
      }
      this.loading = false
    } catch (err) {
      this.error = true
      this.loading = false
      this.errorMessage = err instanceof Error ? err.message : 'Error loading document'
      console.error('Document viewer error:', err)
    }
  }

  onIframeLoad() {
    this.loading = false
  }

  onIframeError() {
    this.loading = false
    this.error = true
    this.errorMessage = 'Failed to load the document'
  }
  ngAfterViewInit() {
    if (this.docIframe && this.docIframe.nativeElement) {
      try {
        const iframeDoc = this.docIframe.nativeElement.contentDocument ||
          this.docIframe.nativeElement.contentWindow.document
        const style = iframeDoc.createElement('style')
        style.textContent = `
          .Header, #BrandBar, #CommandBar, .CommandBar, .TabContainer, .MenuBar {
            display: none !important;
          }
        `
        iframeDoc.head.appendChild(style)
      } catch (e) {
        console.log('Cannot access iframe content due to security restrictions')
      }
    }
  }

  handleClose() {
    this.submitAssignmentAsDraft()
  }

  submitAssignmentAsDraft() {
    const payload = {
      submitUrl: this.documentUrl,
      formId: this.data.assessment.formId,
    }
    this.tocSvc.submitDraftAssignment(payload).subscribe((res: any) => {
      if (res && res.responseCode && res.responseCode === 'OK') {
        this.openSnackbar('Assignment saved as a draft')
        this.dialogRef.close()
      }
    }, error => {
      this.dialogRef.close()
      console.error('Error submitting assignment', error)
    })
  }

  submitAssignment() {
    const payload = {
      submitUrl: this.documentUrl,
      formId: this.data.assessment.formId,
    }
    this.tocSvc.submitAssignment(payload).subscribe((res: any) => {
      if (res && res.responseCode && res.responseCode === 'OK') {
        this.openSnackbar('Assignment Submitted Successfully')
        this.dialogRef.close()
      }
    }, error => {
      this.dialogRef.close()
      console.error('Error submitting assignment', error)
    })
  }

  handleSubmitAssignment() {
    const dialgoData = {
      description: 'Are you sure you want to submit your assignment? Once submitted, you won’t be able to make any changes',
      iconName: 'info_circle',
      type: 'warning',
      buttonsPositionClass: 'justify-center items-center',
      buttons: [
        {
          classes: 'btn-out-line',
          text: 'Discard',
          response: false
        },
        {
          classes: 'succes-button',
          text: 'Submit',
          response: true
        }
      ]
    }
    const dialogRef = this.dialogLegacy.open(ConfirmationDialogComponent, {
      data: dialgoData,
      disableClose: true,
      width: '400px',
      maxWidth: '90vw'
    })

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.submitAssignment()
      } else {
        this.dialogRef.close()
      }
    })
  }

  openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }

}
