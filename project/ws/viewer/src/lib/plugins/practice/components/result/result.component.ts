import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { NsContent } from '@sunbird-cb/utils/src/public-api'
import { NSPractice } from '../../practice.model'

@Component({
  selector: 'viewer-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
})
export class ResultComponent implements OnInit {
  @Input() learningObjective = ''
  @Input() complexityLevel = ''
  @Input() primaryCategory = NsContent.EPrimaryCategory.PRACTICE_RESOURCE
  @Input() duration = 0
  @Input() timeLimit = 0
  @Input() noOfQuestions = 0
  @Output() userSelection = new EventEmitter<NSPractice.TUserSelectionType>()
  questionTYP = NsContent.EPrimaryCategory
  staticImage = '/assets/images/exam/practice-result.png'
  points = [
    { icon: 'info', text: 'No negative mark' },
    { icon: 'info', text: 'Assessment will have no time duration' },
    { icon: 'info', text: 'Skipped question can be attempted again before submitting' },
  ]
  constructor() { }

  ngOnInit() {
  }

  overviewed(event: NSPractice.TUserSelectionType) {
    this.userSelection.emit(event)
  }
}
