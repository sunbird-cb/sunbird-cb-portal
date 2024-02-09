import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import {
  MatToolbarModule,
  MatDividerModule,
  MatExpansionModule,
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatSidenavModule,
  MatMenuModule,
  MatFormFieldModule,
  MatInputModule,
} from '@angular/material'
import { BtnPageBackNavModule } from '@sunbird-cb/collection'
import { HorizontalScrollerModule, PipeSafeSanitizerModule } from '@sunbird-cb/utils'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
import { FaqComponent } from './components/faq.component'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'
import { HttpLoaderFactory } from 'src/app/app.module'
import { HttpClient } from '@angular/common/http'

@NgModule({
  declarations: [FaqComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatDividerModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,

    BtnPageBackNavModule,
    HorizontalScrollerModule,
    WidgetResolverModule,
    PipeSafeSanitizerModule,
    MatMenuModule,
    MatSidenavModule,

    MatFormFieldModule,
    MatInputModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  exports: [FaqComponent],
})

export class FaqModule { }
