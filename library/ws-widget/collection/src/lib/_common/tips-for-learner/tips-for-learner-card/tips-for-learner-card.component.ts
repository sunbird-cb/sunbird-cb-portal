import { Component, Input, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'ws-widget-tips-for-learner-card',
  templateUrl: './tips-for-learner-card.component.html',
  styleUrls: ['./tips-for-learner-card.component.scss'],
})
export class TipsForLearnerCardComponent implements OnInit {
  randomlearnAdvisoryObj: any
  learnAdvisoryDataLength: any
  @Input() learnAdvisoryData: any
  constructor(private router: Router) { }

  ngOnInit() {
    this.displayRandomlearnAdvisoryData()
  }

  displayRandomlearnAdvisoryData(): void {
    if (this.learnAdvisoryData && this.learnAdvisoryData.length) {
      const randomIndex = Math.floor(Math.random() * this.learnAdvisoryData.length)
      this.randomlearnAdvisoryObj = this.learnAdvisoryData[randomIndex]
    }

  }

  showAllTips() {
    this.router.navigate(['/learner-advisory'])
  }

}
