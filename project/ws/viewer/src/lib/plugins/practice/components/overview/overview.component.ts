import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core'
import { MultilingualTranslationsService, NsContent } from '@sunbird-cb/utils-v2'
import { NSPractice } from '../../practice.model'
import { ActivatedRoute } from '@angular/router'
import { ViewerHeaderSideBarToggleService } from './../../../../viewer-header-side-bar-toggle.service'
import { PracticeService } from '../../practice.service'
import { FinalAssessmentPopupComponent } from './../final-assessment-popup/final-assessment-popup.component'
import { MatDialog, MatSnackBar } from '@angular/material'
@Component({
  selector: 'viewer-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit, OnChanges, OnDestroy {
  @Input() learningObjective = ''
  @Input() complexityLevel = ''
  @Input() primaryCategory = NsContent.EPrimaryCategory.PRACTICE_RESOURCE
  @Input() duration = 0
  @Input() timeLimit = 0
  @Input() noOfQuestions = 0
  @Input() canAttempt!: NSPractice.IRetakeAssessment
  @Input() coursePrimaryCategory: any
  @Input() instructionAssessment: any
  @Input() selectedAssessmentCompatibilityLevel: any
  @Output() userSelection = new EventEmitter<NSPractice.TUserSelectionType>()
  @Input() forPreview = false
  @Input() quizData: any
  forCreatorMode = window.location.href.includes('editMode=true')
  questionTYP = NsContent.EPrimaryCategory
  // staticImage = '/assets/images/exam/practice-test.png'
  staticImage = '/assets/images/exam/practice-result.png'
  loading = false
  points = [
    { icon: 'info', text: 'No negative marking' },
    { icon: 'info', text: 'Assessment will have time duration' },
    { icon: 'info', text: 'Skipped question can be attempted again before submitting' },
  ]
  isretakeAllowed = false
  dataSubscription: any
  consentGiven = false
  maxAttempPopup = false
  currentPage = 0
  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    public snackbar: MatSnackBar,
    public viewerHeaderSideBarToggleService: ViewerHeaderSideBarToggleService,
    private quizSvc: PracticeService,
    private langtranslations: MultilingualTranslationsService,
  ) { }

  ngOnInit() {
    this.dataSubscription = this.route.data.subscribe(data => {
      if (data && data.pageData) {
        if (data && data.content && data.content.data && data.content.data.identifier) {
          const identifier =  data.content.data.identifier
          if (identifier && !this.forPreview) {
            this.checkForAssessmentSubmitAlready(identifier)
          }
        }
        this.isretakeAllowed = data.pageData.data.isretakeAllowed
      }
    })
  }

  ngOnChanges() {
    if (!this.forPreview) {
      if (this.canAttempt && (this.canAttempt.attemptsMade >= this.canAttempt.attemptsAllowed) &&
          this.questionTYP.FINAL_ASSESSMENT === this.primaryCategory) {
        if (!this.maxAttempPopup && this.selectedAssessmentCompatibilityLevel > 6) {
          this.showAssessmentPopup()
        }
      }
    }

  }

  showAssessmentPopup() {
    this.maxAttempPopup = true
    const popupData = {
      headerText: 'this.resourceName',
      assessmentType: 'maxAttemptReached',

      warningNote: 'Do you want to submit your test finally. After submitting test, you will have to start the test from beginning.',
      buttonsList: [
        {
          response: 'yes',
          text: 'Ok',
          classes: 'blue-full',
        },
      ],
    }
    const dialogRef =  this.dialog.open(FinalAssessmentPopupComponent, {
      data: popupData,
      width: '626px',
      maxWidth: '90vw',
      height: 'auto',
      maxHeight: '225px',
      panelClass: 'final-assessment',
    })
    // dialogRef.componentInstance.xyz = this.configSvc
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        switch (result) {
          case 'yes':
            this.maxAttempPopup = false
          // this.submitQuiz()
          break
        }

      }
    })
  }

  checkForAssessmentSubmitAlready(identifier: any) {
    if (this.selectedAssessmentCompatibilityLevel) {
      if (this.selectedAssessmentCompatibilityLevel < 7 && this.questionTYP.FINAL_ASSESSMENT === this.primaryCategory) {
        this.quizSvc.canAttend(identifier).subscribe(response => {
          if (response && response.attemptsMade > 0 && response.attemptsMade < response.attemptsAllowed) {
            this.quizSvc.checkAlreadySubmitAssessment.next(true)
          }
        })
      } else {
        // this.quizSvc.canAttendV5(identifier).subscribe(response => {
        //   if (response && response.attemptsMade > 0 && response.attemptsMade < response.attemptsAllowed) {
        //     this.quizSvc.checkAlreadySubmitAssessment.next(true)
        //   } else {
        //     this.quizSvc.checkAlreadySubmitAssessment.next(false)
        //   }
        // })
      }
    }

  }

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe()
    }
  }

  overviewed(event: NSPractice.TUserSelectionType) {
    if ((this.forPreview && !this.forCreatorMode) &&
      this.primaryCategory === this.questionTYP.FINAL_ASSESSMENT) {
      if (this.quizData && this.quizData.isPublic) {
        this.loading = true
        this.userSelection.emit(event)
        this.viewerHeaderSideBarToggleService.visibilityStatus.next(false)
      } else {
        this.snackbar.open('The content is not available to access.')
      }
    } else {
      this.loading = true
      this.userSelection.emit(event)
      this.viewerHeaderSideBarToggleService.visibilityStatus.next(false)
    }
  }

  translateLabels(label: string, type: any) {
    return this.langtranslations.translateLabel(label, type, '')
  }

  startTestEnable(event: any) {
    // tslint:disable-next-line
    console.log('event', event)
    this.consentGiven = !this.consentGiven
  }

  nextPage(): void {
    if (this.instructionAssessment && (this.currentPage < this.instructionAssessment.length - 1)) {
      this.currentPage = this.currentPage + 1
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage = this.currentPage - 1
    }
  }
}
