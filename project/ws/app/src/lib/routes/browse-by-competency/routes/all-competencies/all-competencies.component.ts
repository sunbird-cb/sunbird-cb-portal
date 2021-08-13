import { Component, OnInit } from '@angular/core'


@Component({
  selector: 'ws-app-all-competencies',
  templateUrl: './all-competencies.component.html',
  styleUrls: ['./all-competencies.component.scss'],
})
export class AllCompetenciesComponent implements OnInit {
  titles = [
    { title: 'Learn', url: '/page/learn', icon: 'school' },
    { title: 'All Competencies' , url: 'none', icon: '' },
  ]

  compentency = 'some-competency'

  constructor() { }

  ngOnInit() {
  }

}
