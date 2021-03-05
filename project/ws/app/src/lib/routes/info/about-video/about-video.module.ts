import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AboutVideoComponent } from './about-video.component'
import { MatRadioModule, MatButtonModule, MatToolbarModule } from '@angular/material'
import { LocaleTranslatorModule, BtnPageBackModule } from '@sunbird-cb/collection'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
import { RouterModule } from '@angular/router'

@NgModule({
  declarations: [AboutVideoComponent],
  imports: [
    CommonModule,
    MatRadioModule,
    RouterModule,
    WidgetResolverModule,
    LocaleTranslatorModule,
    MatButtonModule,
    BtnPageBackModule,
    MatToolbarModule,
  ],
  exports: [AboutVideoComponent],
})
export class AboutVideoModule { }
