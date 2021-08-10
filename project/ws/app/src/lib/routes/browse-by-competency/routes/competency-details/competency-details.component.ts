import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'ws-app-competency-details',
  templateUrl: './competency-details.component.html',
  styleUrls: ['./competency-details.component.scss'],
})
export class CompetencyDetailsComponent implements OnInit {
  titles = [
    { title: 'Learn', url: '/page/learn', icon: 'school' },
    { title: 'All Competencies' , url: '/app/learn/browse-by', icon: '' },
  ]
  competencyName = 'Sample competency'
  constructor() { }

  ngOnInit() {
    this.titles.push({ title: this.competencyName , url: 'none', icon: '' })
  }

}
