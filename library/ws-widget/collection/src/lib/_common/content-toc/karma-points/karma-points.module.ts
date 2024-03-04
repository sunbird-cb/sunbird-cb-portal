import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SlidersDynamicModule } from '../../../sliders-dynamic/sliders-dynamic.module'

import { KarmaPointsComponent } from './karma-points.component'

@NgModule({
  declarations: [KarmaPointsComponent],
  imports: [
    CommonModule,
    SlidersDynamicModule,
  ],
  exports: [
    KarmaPointsComponent,
  ],
})
export class KarmaPointsModule { }
