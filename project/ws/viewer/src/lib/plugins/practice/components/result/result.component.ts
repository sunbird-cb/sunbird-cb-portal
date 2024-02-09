import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core'
import { NsContent } from '@sunbird-cb/utils/src/public-api'
import { NSPractice } from '../../practice.model'
import { MatAccordion } from '@angular/material/expansion'

@Component({
  selector: 'viewer-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
})
export class ResultComponent implements OnChanges {
  @Input() percentage = 0
  @Input() levelText!: string
  @Input() isPassed = false
  @Input() quizCategory!: NsContent.EPrimaryCategory
  @Input() quizResponse!: NSPractice.IQuizSubmitResponseV2
  @Output() userSelection = new EventEmitter<string>()
  @Output() fetchResult = new EventEmitter<string>()
  @ViewChild(MatAccordion, { static: true }) accordion: MatAccordion | undefined
  staticImage = '/assets/images/exam/practice-result.png'
  questionTYP = NsContent.EPrimaryCategory
  selectedQuestionData: any
  activeQuestionSet:any = '';
  color = 'warn';
  mode = 'determinate';
  value = 45;
  showText = 'Rating';
  constructor() {
    
  }

  ngOnChanges() {
  }

  action(event: NSPractice.TUserSelectionType) {
    this.userSelection.emit(event)
  }
  get isOnlySection(): boolean {
    return this.quizResponse.children.length === 1
  }

  checkRes() {
    if (this.quizResponse) {
      if (typeof this.quizResponse === 'string') {
        return true
      }
    }
    return false
  }

  retryResult() {
    this.fetchResult.emit()
  }
  getQuestionCount(data: any, activeQuestionSet:any) {
    this.activeQuestionSet = activeQuestionSet;
    this.selectedQuestionData = data
  }
}
