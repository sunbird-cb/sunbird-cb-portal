import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ws-app-competency-card',
  templateUrl: './competency-card.component.html',
  styleUrls: ['./competency-card.component.scss']
})
export class CompetencyCardComponent implements OnInit {

  competenciesData = [
    {
      competencyType: 'Behavioural',
      description: 'Planning vigilance activities in accordance with procedures that balance the needs of maintaining a fraud free environment and business objectives',
      id: 1,
      name: 'Design thinking',
      competencyLevel: ['Level 1', 'Level 2', 'Level 3']
    },
    {
      competencyType: 'Budget Analysis',
      description: 'Read, interpret, and evaluate budget documents to understand and evaluate the underlying intent of a budgetary policy.',
      id: 2,
      name: 'Functional',
      competencyLevel: ['Level 1', 'Level 2', 'Level 3']
    },
    {
      competencyType: 'Financial Modelling',
      description: 'Develop financial models and valuation models to arrive at a valuation conclusion',
      id: 1,
      name: 'finance',
      competencyLevel: ['Level 1', 'Level 2', 'Level 3']
    },
    {
      competencyType: 'Enterprise Architecture',
      description: 'Operationalise a business strategy on the planning and development of business structures and models to facilitate the evolution of a business to its desired future state. This involves the review and prioritisation of market trends, evaluation of alternative strategies, as well as the strategic evaluation and utilisation of enterprise capability and technology to support business requirements',
      id: 1,
      name: 'finance',
      competencyLevel: ['Level 1', 'Level 2', 'Level 3']
    }
  ]

  constructor() { }

  ngOnInit() {
  }

}
