import { Component, Input, OnInit } from '@angular/core'
import { NsContent } from '@sunbird-cb/utils/src/public-api'

@Component({
  selector: 'viewer-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
})
export class ResultComponent implements OnInit {
  @Input() percentage = 0
  @Input() levelText = 'Level 2 Passed'
  @Input() isPassed = false
  staticImage = '/assets/images/exam/practice-test.png'
  questionTYP = NsContent.EPrimaryCategory
  constructor() { }

  ngOnInit() {
  }

  // overviewed(event: NSPractice.TUserSelectionType) {
  //   // this.userSelection.emit(event)
  // }
}
