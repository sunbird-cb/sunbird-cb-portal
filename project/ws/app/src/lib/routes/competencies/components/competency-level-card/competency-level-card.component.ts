import { Component, OnInit, Input } from '@angular/core'
import { NSCompetencie } from '../../models/competencies.model'

@Component({
  selector: 'ws-app-competency-level-card',
  templateUrl: './competency-level-card.component.html',
  styleUrls: ['./competency-level-card.component.scss'],
})
export class CompetencyLevelCardComponent implements OnInit {
  @Input()
  data!: NSCompetencie.ICompetencie
  @Input()
  isSelected!: boolean
  constructor() { }

  ngOnInit() {
  }

}
