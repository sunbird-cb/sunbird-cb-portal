import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PublicLogoutComponent } from './public-logout.component'
import {
  MatToolbarModule,
  MatCardModule,
  MatDividerModule,
  MatIconModule,
  MatExpansionModule,
} from '@angular/material'
import { BtnPageBackModule } from '@sunbird-cb/collection'
import { PipeSafeSanitizerModule } from '@sunbird-cb/utils-v2'
import { RouterModule } from '@angular/router'

@NgModule({
  declarations: [PublicLogoutComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    BtnPageBackModule,
    MatDividerModule,
    MatIconModule,
    MatExpansionModule,
    PipeSafeSanitizerModule,
    RouterModule,
  ],
  exports: [PublicLogoutComponent],
})
export class PublicLogoutModule { }
