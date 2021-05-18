import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PublicContactComponent } from './public-contact.component'
import {
  MatToolbarModule,
  MatCardModule,
  MatDividerModule,
  MatIconModule,
  MatExpansionModule,
} from '@angular/material'
import { BtnPageBackModule } from '@sunbird-cb/collection'
import { PipeSafeSanitizerModule } from '@sunbird-cb/utils'

@NgModule({
  declarations: [PublicContactComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    BtnPageBackModule,
    MatDividerModule,
    MatIconModule,
    MatExpansionModule,
    PipeSafeSanitizerModule,
  ],
  exports: [PublicContactComponent],
})
export class PublicContactModule { }
