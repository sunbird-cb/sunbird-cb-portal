import { Component, OnInit, Input, OnChanges } from '@angular/core'
import { NSMandatoryCourseData } from '../../models/mandatory-course.model'

@Component({
  selector: 'ws-app-mandatory-course-stats',
  templateUrl: './mandatory-course-stats.component.html',
  styleUrls: ['./mandatory-course-stats.component.scss'],
})
export class MandatoryCourseStatsComponent implements OnInit, OnChanges {
  @Input() stats!: NSMandatoryCourseData.IMandatoryCourseStats

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
  }

}
