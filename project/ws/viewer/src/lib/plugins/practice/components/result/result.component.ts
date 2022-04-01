import { Component, Input, OnInit } from '@angular/core'
import { NsContent } from '@sunbird-cb/utils/src/public-api'
import { NSPractice } from '../../practice.model'

@Component({
  selector: 'viewer-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
})
export class ResultComponent implements OnInit {
  @Input() percentage = 0
  @Input() levelText!: string
  @Input() isPassed = false
  @Input() quizResponse!: NSPractice.IQuizSubmitResponseV2
  staticImage = '/assets/images/exam/practice-result.png'
  questionTYP = NsContent.EPrimaryCategory
  constructor() { }

  ngOnInit() {
  }

  // overviewed(event: NSPractice.TUserSelectionType) {
  //   // this.userSelection.emit(event)
  // }
}
