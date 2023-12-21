import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { CompetencyPassbookComponent } from './competency-passbook/competency-passbook.component'
import { CompetencyListComponent } from './competency-list/competency-list.component'
import { CompetencyCardDetailsComponent } from './competency-card-details/competency-card-details.component'

const routes: Routes = [
  {
    path: '',
    component: CompetencyPassbookComponent,
    children: [
      {
        path: 'list',
        component: CompetencyListComponent
      },
      {
        path: 'details',
        component: CompetencyCardDetailsComponent
      }
    ]
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  providers: [],
})

export class CompetencyPassbookRoutingModule { }
