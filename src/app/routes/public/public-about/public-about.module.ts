import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PublicAboutComponent } from './public-about.component'
import {
  MatToolbarModule,
  MatDividerModule,
  MatExpansionModule,
  MatIconModule,
  MatCardModule,
  MatButtonModule,
} from '@angular/material'
import { BtnPageBackModule } from '@sunbird-cb/collection'
import { HorizontalScrollerModule, PipeSafeSanitizerModule } from '@sunbird-cb/utils-v2'

@NgModule({
  declarations: [PublicAboutComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatDividerModule,
    MatExpansionModule,
    MatIconModule,
    MatCardModule,
    BtnPageBackModule,
    MatButtonModule,

    HorizontalScrollerModule,
    PipeSafeSanitizerModule,
  ],

  exports: [PublicAboutComponent],
})
export class PublicAboutModule {}
