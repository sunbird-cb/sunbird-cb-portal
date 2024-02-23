import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core'
import { MultilingualTranslationsService, NsContent } from '@sunbird-cb/utils/src/public-api'
import { NSPractice } from '../../practice.model'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'viewer-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit, OnDestroy {
  @Input() learningObjective = ''
  @Input() complexityLevel = ''
  @Input() primaryCategory = NsContent.EPrimaryCategory.PRACTICE_RESOURCE
  @Input() duration = 0
  @Input() timeLimit = 0
  @Input() noOfQuestions = 0
  @Input() canAttempt!: NSPractice.IRetakeAssessment
  @Output() userSelection = new EventEmitter<NSPractice.TUserSelectionType>()
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

  constructor(private langtranslations: MultilingualTranslationsService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.dataSubscription = this.route.data.subscribe(data => {
      if (data && data.pageData) {
        this.isretakeAllowed = data.pageData.data.isretakeAllowed
      }
    })
  }

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe()
    }
  }

  overviewed(event: NSPractice.TUserSelectionType) {
    this.loading = true
    this.userSelection.emit(event)
  }
  
  translateLabels(label: string, type: any) {
    return this.langtranslations.translateLabel(label, type, '')
  }
}
