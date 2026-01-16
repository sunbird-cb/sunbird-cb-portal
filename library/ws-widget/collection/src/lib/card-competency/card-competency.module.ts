import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { CardCompetencyComponent } from './card-competency.component'

@NgModule({
    declarations: [CardCompetencyComponent],
    imports: [
        CommonModule,
    ],
    exports: [
        CardCompetencyComponent,
    ]
})

export class CardCompetencyModule { }
