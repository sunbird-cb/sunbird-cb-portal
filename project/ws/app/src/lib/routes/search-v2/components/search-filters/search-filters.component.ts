import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'ws-app-search-filters',
  templateUrl: './search-filters.component.html',
  styleUrls: ['./search-filters.component.scss'],
})
export class SearchFiltersComponent implements OnInit {
  filteroptions: any

  constructor() { }

  ngOnInit() {
    this.filteroptions = [
      {
        name: 'Provider',
        values: [
          {
            count: 5,
            name: 'iGot Learning',
          },
          {
            count: 5,
            name: 'J-pal',
          },
          {
            count: 5,
            name: 'Udemy',
          },
          {
            count: 5,
            name: 'LBSNAA',
          },
        ],
      },
      {
        name: 'Content type',
        values: [
          {
            count: 5,
            name: 'Course',
          },
          {
            count: 5,
            name: 'Module',
          },
          {
            count: 5,
            name: 'Resources',
            subvalues: [
              {
                count: 5,
                name: 'Video',
              },
              {
                count: 5,
                name: 'PDF',
              },
              {
                count: 5,
                name: 'Audio',
              },
              {
                count: 5,
                name: 'Assessment',
              },
            ],
          },
        ],
      },
      {
        name: 'Content cost',
        values: [
          {
            count: 5,
            name: 'Free',
          },
          {
            count: 5,
            name: 'Paid',
          },
        ],
      },
      {
        name: 'Topics',
        values: [
          {
            count: 5,
            name: 'Business of healthcare',
          },
          {
            count: 5,
            name: 'Healthcare',
          },
        ],
      },
      {
        name: 'Learning Levels',
        values: [
          {
            count: 5,
            name: 'Beginner',
          },
          {
            count: 5,
            name: 'Intermediate',
          },
          {
            count: 5,
            name: 'Advanced',
          },
        ],
      },
      {
        name: 'Competency type',
        values: [
          {
            count: 5,
            name: 'Behavioural',
          },
          {
            count: 5,
            name: 'Domain',
          },
          {
            count: 5,
            name: 'Functional',
          },
        ],
      },
      {
        name: 'Completion time',
        values: [
          {
            count: 5,
            name: '30 min to 1 hr',
          },
          {
            count: 5,
            name: '2 hrs to 5 hrs',
          },
          {
            count: 5,
            name: '5hrs and more',
          },
        ],
      },
    ]
  }

}
