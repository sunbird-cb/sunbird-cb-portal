<<<<<<< HEAD
import { Component, Input, OnInit } from '@angular/core'
=======
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
>>>>>>> origin/cbrelease-4.0.1
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
<<<<<<< HEAD
  @Input() quizResponse!: NSPractice.IQuizSubmitResponseV2
=======
  @Input() quizCategory!: NsContent.EPrimaryCategory
  @Input() quizResponse!: NSPractice.IQuizSubmitResponseV2
  @Output() userSelection = new EventEmitter<string>()
>>>>>>> origin/cbrelease-4.0.1
  staticImage = '/assets/images/exam/practice-result.png'
  questionTYP = NsContent.EPrimaryCategory
  constructor() { }

  ngOnInit() {
  }

<<<<<<< HEAD
  // overviewed(event: NSPractice.TUserSelectionType) {
  //   // this.userSelection.emit(event)
  // }
=======
  action(event: NSPractice.TUserSelectionType) {
    this.userSelection.emit(event)
  }

>>>>>>> origin/cbrelease-4.0.1
}
