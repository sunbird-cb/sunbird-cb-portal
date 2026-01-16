// app-toc-assignment-viewerV2.component.ts
import { Component, Inject, OnInit, OnDestroy } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { MatLegacyDialog } from '@angular/material/legacy-dialog'
import { MatLegacySnackBar } from '@angular/material/legacy-snack-bar'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { Router } from '@angular/router'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { AppTocService } from '@ws/app/src/lib/routes/app-toc/services/app-toc.service'
import { ConfirmationDialogComponent } from '@sunbird-cb/consumption'
@Component({
  selector: 'ws-widget-app-assignment-viewerV2',
  templateUrl: './app-toc-assignment-viewerV2.component.html',
  styleUrls: ['./app-toc-assignment-viewerV2.component.scss'],
})
export class AssignmentViewerV2Component implements OnInit, OnDestroy {

  // Properties for file preview
  safeSrc: SafeResourceUrl | null = null;
  fileBlob: Blob | null = null;
  fileUrl: string = '';
  fileType: string = '';
  fileName: string = '';
  isLoading: boolean = false;
  error: boolean = false;
  errorMessage: string = '';
  showPdfViewer = false;
  showDownloadOption = false;
  documentNotSupported = false;

  constructor(
    public router: Router,
    public tocSvc: AppTocService,
    public configSvc: ConfigurationsService,
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<AssignmentViewerV2Component>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogLegacy: MatLegacyDialog,
    private snackBar: MatLegacySnackBar,
  ) { }

  ngOnInit() {
    if (this.data.url) {
      const urlParts = this.data.url.split('/');
      this.fileName = urlParts[urlParts.length - 1];
      this.fileName = this.fileName.split('?')[0];
      this.fileName = decodeURIComponent(this.fileName);
      this.fileType = this.getFileType(this.fileName)
      this.readFile()
    }
  }

  readFile() {
    if (!this.data.contentId) {
      this.handleError('Content ID is missing');
      return;
    }
    if (!this.data.batchId) {
      this.handleError('Batch ID is missing');
      return;
    }
    if (!this.data.assessment?.id) {
      this.handleError('Assignment ID is missing');
      return;
    }
    if (!this.fileName) {
      this.handleError('File name is missing');
      return;
    }

    this.isLoading = true;
    this.error = false;

    this.tocSvc.readAssignmentFile(
      this.data.contentId,
      this.data.batchId,
      this.data.assessment.formId,
      this.fileName
    ).subscribe({
      next: (res: any) => {
        if (res) {
          this.processFileData(res);
        } else {
          this.handleError('No file data received');
        }
      },
      error: (error) => {
        this.handleError(`Failed to load file: ${error.message || 'Unknown error'}`);
      }
    });
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

  submitAssignment() {
    const payload = {
      submitUrl: this.data.url,
      formId: this.data.assessment.formId,
    }
    this.tocSvc.submitAssignment(payload).subscribe((res: any) => {
      if (res && res.responseCode && res.responseCode === 'OK') {
        this.openSnackbar('Assignment Submitted Successfully')
        this.dialogRef.close()
        this.notifyAssignmentSubmission()
      }
    }, error => {
      this.dialogRef.close()
      console.error('Error submitting assignment', error)
    })
  }
  async notifyAssignmentSubmission() {
    const payload = {
      courseId: this.data.contentId,
      batchId: this.data.batchId,
      assignmentTitle: this.data.assessment.title,
      instructorId: this.data.assessment.createdBy,
    }
    this.tocSvc.notifyAssignmentSubmission(payload).subscribe((res: any) => {
      if (res && res.responseCode && res.responseCode === 'OK') {
        console.log('Notified assignment submission')
      }
    }, error => {
      console.error('Error notifying assignment submission', error)
    })
  }


  private processFileData(fileData: any) {
    try {
      let blobData: Blob;

      if (fileData instanceof Blob) {
        const correctMimeType = this.getMimeType();
        if (fileData.type !== correctMimeType && fileData.type.includes('multipart/form-data')) {
          blobData = new Blob([fileData], { type: correctMimeType });
        } else {
          blobData = fileData;
        }
      } else if (fileData instanceof ArrayBuffer) {
        blobData = new Blob([fileData], { type: this.getMimeType() });
      } else if (typeof fileData === 'string') {
        // Check if it's base64
        if (fileData.startsWith('data:')) {

          // Data URL format
          const response = fetch(fileData);
          response.then(res => res.blob()).then(blob => {
            this.fileBlob = blob;
            this.createFileUrl();
            this.setupViewer();
          });
          return;
        } else {
          // Plain base64
          const byteCharacters = atob(fileData);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          blobData = new Blob([byteArray], { type: this.getMimeType() });
        }
      } else {
        blobData = new Blob([JSON.stringify(fileData)], { type: this.getMimeType() });
      }
      if (blobData.size === 0) {
        throw new Error('Blob is empty (size: 0)');
      }

      this.fileBlob = blobData;
      this.createFileUrl();
      this.setupViewer();

    } catch (error) {
      this.handleError(`Failed to process file data: ${error}`);
    }
  }

  private createFileUrl() {
    if (this.fileBlob) {
      // Clean up previous URL
      if (this.fileUrl) {
        URL.revokeObjectURL(this.fileUrl);
      }

      // Create new object URL
      this.fileUrl = URL.createObjectURL(this.fileBlob);
    } else {
      console.log('No file blob available to create URL');
    }
  }

  private setupViewer() {
    this.isLoading = false;

    if (!this.fileUrl) {
      this.handleError('No file URL available');
      return;
    }

    if (this.fileType === 'pdf') {
      this.setupPdfViewer();
    } else {
      this.documentNotSupported = true;
      this.showDownloadOption = true;
    }
  }

  private setupPdfViewer() {
    try {
      // Try direct PDF viewer first
      const pdfUrlWithParams = this.fileUrl + '#toolbar=0&navpanes=0&scrollbar=0'
      this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrlWithParams);
      this.showPdfViewer = true;
    } catch (error) {
      console.error('Error setting up PDF viewer:', error);
      this.handleError('Failed to setup PDF viewer');
    }
  }

  private getFileType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();

    if (extension === 'pdf') {
      return 'pdf';
    }
    return 'unknown';
  }

  private getMimeType(): string {
    if (this.fileType === 'pdf') {
      return 'application/pdf';
    }
    return 'application/octet-stream';
  }

  private handleError(message: string) {
    this.isLoading = false;
    this.error = true;
    this.errorMessage = message;
    this.snackBar.open(message, 'Close', { duration: 5000 });
  }

  // Public methods for template
  downloadFile() {
    if (this.fileBlob) {
      const url = URL.createObjectURL(this.fileBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }

  onIframeLoad() {
    console.log('Iframe loaded successfully');
  }

  onIframeError() {
    console.error('Iframe failed to load');
    this.handleError('Failed to load document in viewer');
  }

  handleClose() {
    this.submitAssignmentAsDraft()
  }

  openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }

  submitAssignmentAsDraft() {
    const payload = {
      submitUrl: this.data.url,
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

  closeDialog() {
    if (this.fileUrl) {
      URL.revokeObjectURL(this.fileUrl);
    }
    this.dialogRef.close();
  }

  retryLoad() {
    this.error = false;
    this.errorMessage = '';
    this.readFile();
  }

  ngOnDestroy() {
    if (this.fileUrl) {
      URL.revokeObjectURL(this.fileUrl);
    }
  }
}