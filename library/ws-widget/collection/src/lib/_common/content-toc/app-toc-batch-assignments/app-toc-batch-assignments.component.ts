import { Component, Input, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatLegacySnackBar } from '@angular/material/legacy-snack-bar'
import { ActivatedRoute, Router } from '@angular/router'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { AppTocService } from '@ws/app/src/lib/routes/app-toc/services/app-toc.service'
import { ConfirmationDialogComponent } from '@sunbird-cb/consumption'
import { MatLegacyDialog } from '@angular/material/legacy-dialog'
import * as _ from 'lodash'
import { AssignmentViewerV2Component } from '../app-toc-assignment-viewerV2/app-toc-assignment-viewerV2.component'

@Component({
  selector: 'ws-widget-app-batch-assignments',
  templateUrl: './app-toc-batch-assignments.component.html',
  styleUrls: ['./app-toc-batch-assignments.component.scss'],
})

export class AppTocBatchAssignmentsComponent implements OnInit {

  @Input() content: any
  assignments: any[] = []
  allowType: string[] = ['.pdf']
  fileExtention: any
  resourceFileAdded: any
  isLoading: boolean = false
  selectedAssignment: any
  batchId: any
  submissions: any[] = []


  constructor(public router: Router,
    private snackBar: MatLegacySnackBar,
    public tocSvc: AppTocService,
    public configSvc: ConfigurationsService,
    private dialog: MatDialog,
    private dialogLegacy: MatLegacyDialog,
    private route: ActivatedRoute,
  ) {
    this.batchId = this.route.snapshot.queryParams.batchId ?
      this.route.snapshot.queryParams.batchId : ''
  }

  ngOnInit() {
    this.fetchAssignments()
  }

  getUserAssignmentStatus() {
    if (this.configSvc.userProfile && this.configSvc.userProfile.userId) {
      const request = {
        filters: {
          contextId: this.content.identifier,
          submittedBy: this.configSvc.userProfile.userId
        }
      }
      this.tocSvc.getAssignmentStatus(request).subscribe((response: any) => {
        this.submissions = _.get(response, 'result.response.content', [])
        console.log('submissions', this.submissions)
        this.processAssignmentsWithStatus()
      }, error => {
        console.error('Error fetching assignment status', error)
      })
    }
  }

  processAssignmentsWithStatus() {
    this.assignments = this.assignments.map((assignment: any) => ({
      ...assignment,
      expand: false,
      downloading: false,
      enableDownload: false,
      answerURL: this.submissions.find(sub => sub.formId === assignment.formId)?.submitUrl || '',
      status: this.submissions.find(sub => sub.formId === assignment.formId)?.status || 'PENDING',
      enableView: this.submissions.find(sub => sub.formId === assignment.formId)?.status === 'EVALUATED',
      submissionMeta: this.submissions.find(sub => sub.formId === assignment.formId)?.status === 'EVALUATED' ? this.submissions.find(sub => sub.formId === assignment.formId)?.submissionMeta : {}
    }))
  }
  fetchAssignments() {
    const payload: any = {
      query: '',
      filters: {
        "additionalProperties.batchId": this.batchId,
      },
    }
    this.tocSvc.searchAssignments(payload).subscribe((response: any) => {
      let assignments = _.get(response, 'result.response.content', [])
      this.assignments = assignments.map((assignment: any) => ({
        ...assignment,
        expand: false,
        downloading: false,
        enableView: false,
        enableDownload: false,
        answerURL: '',
        status: '',
        submissionMeta: {}
      }))
      this.getUserAssignmentStatus()
    }, error => {
      console.error('Error fetching assignments', error)
    })
  }

  handleViewFeedback(assignment: any) {
    assignment.expand = true
  }

  downloadFile(assignment: any) {
    assignment.downloading = true
    assignment.enableDownload = true
    this.selectedAssignment = assignment
    this.downloadFileWithFetch(assignment)
  }

  downloadFileDirectly(assignment: any) {
    if (assignment.additionalProperties.assignmentUrl) {
      window.open(assignment.additionalProperties.assignmentUrl, '_blank')
      assignment.downloading = false
    }
  }

  async downloadFileWithFetch(assignment: any) {
    if (!assignment.additionalProperties.assignmentUrl) return
    try {
      const response = await fetch(assignment.additionalProperties.assignmentUrl)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = this.extractFilenameFromUrl(assignment.additionalProperties.assignmentUrl) || `${assignment.title}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      assignment.downloading = false
    } catch (error) {
      console.error('Download failed:', error)
      this.downloadFileDirectly(assignment)
    }
  }


  triggerFileUpload(assignment: any) {
    this.selectedAssignment = assignment
    if (assignment.answerURL) {
      this.submitAssignment(assignment)
    } else {
      const fileInput = document.getElementById('sResourceFile') as HTMLInputElement;
      if (fileInput) {
        fileInput.click();
      }
    }

  }

  submitAssignment(assessment: any) {
    console.log('Submit assignment clicked', assessment)
    const dialgoData = {
      description: 'You have already uploaded an assignment. Choose an option below to either keep your current submission or upload a new file.',
      type: 'warning',
      buttonsPositionClass: 'justify-center items-center',
      buttons: [
        {
          classes: 'btn-out-line',
          text: 'Re-upload',
          response: 0
        },
        {
          classes: 'succes-button',
          text: 'Keep Submission',
          response: 1
        }
      ]
    }
    const dialogRef = this.dialogLegacy.open(ConfirmationDialogComponent, {
      data: dialgoData,
      disableClose: false,
      width: '400px',
      maxWidth: '90vw'
    })

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === 1) {
        //this.viewAssignments(assessment.answerURL)
        this.previewAssignments(assessment.answerURL)
      } else if (result === 0) {
        const fileInput = document.getElementById('sResourceFile') as HTMLInputElement;
        if (fileInput) {
          fileInput.click()
        }
      }
    })
  }

  fileInputEmit(fileInput: FileList | null): void {
    if (!fileInput || fileInput.length === 0) {
      return
    }
    const file = fileInput[0]
    if (this.checkFileType(file)) {
      this.upload(file)
    }
  }

  async upload(file: any) {
    this.resourceFileAdded = file
    this.isLoading = true

    try {
      const uploadRes: any = await this.tocSvc.uploadAssignmentAnswer(
        this.content.identifier,
        this.batchId,
        this.selectedAssignment.formId,
        file
      ).toPromise()

      if (uploadRes && uploadRes.responseCode === 'OK') {
        this.openSnackbar('File uploaded successfully')
        this.previewAssignments(uploadRes.result.url)
      } else {
        this.isLoading = false
        this.openSnackbar('File upload failed. Please try again.')
      }
    } catch (error: any) {
      this.isLoading = false
      console.error('Upload API error:', error)
      this.openSnackbar('File upload failed. Please try again.')
    }
  }

  previewAssignments(result: any) {
    this.isLoading = false
    this.callingViewAssignments(result)
  }

  callingViewAssignments(url: any) {
    const dialogRef = this.dialog.open(AssignmentViewerV2Component, {
      width: '40%',
      disableClose: true,
      panelClass: 'dialog_sidenav',
      data: {
        assessment: this.selectedAssignment,
        url: url,
        contentId: this.content.identifier,
        batchId: this.batchId,
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      setTimeout(() => {
        this.fetchAssignments()
      }, 1000)
      console.log(result)
    })
  }


  checkFileType(file: File) {
    let flag = false
    if (file && file.size) {
      const fileInMB = Math.floor(file.size / (1024 * 1024))
      if (fileInMB > 5) {
        this.openSnackbar('File size exceeds 5 MB limit. Please upload a smaller file.')
        return false
      }
    }
    if (file && this.allowType && this.allowType.length > 0) {
      this.allowType.forEach((ele: any) => {
        if (file.name.toLowerCase().endsWith(ele)) {
          flag = true
        }
      })
    }
    if (!flag) {
      this.openSnackbar('Invalid file type uploaded. Please upload supporting format only.')
    }
    this.fileExtention = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
    if (file) {
      if (['.pdf'].includes(this.fileExtention)) {
        flag = true
      } else {
        flag = false
      }
      if (!flag) {
        this.openSnackbar('Invalid file type uploaded. Please upload PDF format only.')
      }
    }
    return flag
  }

  getMarks(submissionMeta: any): string {
    if (submissionMeta?.marksGiven != null && submissionMeta?.maximumMarks != null) {
      return `${submissionMeta.marksGiven}` + '/' + `${submissionMeta.maximumMarks}`
    } else if (submissionMeta?.marksGiven != null) {
      return `${submissionMeta.marksGiven}`
    } else {
      return 'N/A'
    }
  }

  openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }
  extractFilenameFromUrl(url: string): string {
    try {
      const urlParts = url.split('/')
      const filename = urlParts[urlParts.length - 1]
      return filename.includes('.') ? filename : ''
    } catch (error) {
      return ''
    }
  }
}
