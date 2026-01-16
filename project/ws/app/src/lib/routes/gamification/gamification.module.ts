import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { GamificationRoutingModule } from './gamification-routing.module'
import {
  MatTabsModule,
  MatCardModule,
  MatDividerModule,
  MatButtonModule,
  MatToolbarModule,
  MatIconModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
} from '@angular/material'

import { UserImageModule } from '@sunbird-cb/collection'
import { PipeNameTransformModule, PipeCountTransformModule } from '@sunbird-cb/utils-v2'

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    GamificationRoutingModule,
    MatTabsModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatTabsModule,
    MatToolbarModule,
    MatIconModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    UserImageModule,
    PipeNameTransformModule,
    PipeCountTransformModule,
  ],
})
export class GamificationModule { }
