import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PublicContactComponent } from './public-contact.component'
import {
  MatToolbarModule,
  MatCardModule,
  MatDividerModule,
  MatIconModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatInputModule,
} from '@angular/material'
import { BtnPageBackModule, LeftMenuModule } from '@sunbird-cb/collection'
import { PipeSafeSanitizerModule } from '@sunbird-cb/utils'
import { FormsModule } from '@angular/forms'
import { Ng2SearchPipeModule } from 'ng2-search-filter'
import { TranslateModule } from '@ngx-translate/core'

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
    LeftMenuModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    Ng2SearchPipeModule,
    TranslateModule
  ],
  exports: [PublicContactComponent, TranslateModule],

})
export class PublicContactModule { }
