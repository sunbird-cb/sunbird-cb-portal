import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatIconModule } from '@angular/material'
import { HttpClient } from '@angular/common/http'
import { HttpLoaderFactory } from 'src/app/app.module'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'

import { PipeDurationTransformModule } from '@sunbird-cb/utils/src/public-api'

import { TocKpiValuesComponent } from './toc-kpi-values.component'

@NgModule({
  declarations: [TocKpiValuesComponent],
  imports: [
    CommonModule,
    MatIconModule,
    PipeDurationTransformModule,
    TranslateModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  exports: [
    TocKpiValuesComponent,
  ],
})
export class TocKpiValuesModule { }
