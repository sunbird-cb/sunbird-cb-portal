import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PublicContactComponent } from './public-contact.component'
import { BtnPageBackModule, LeftMenuModule } from '@sunbird-cb/collection'
import { PipeSafeSanitizerModule } from '@sunbird-cb/utils-v2'
import { FormsModule } from '@angular/forms'
// import { Ng2SearchPipeModule } from 'ng2-search-filter'
import { TranslateModule } from '@ngx-translate/core'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatDividerModule } from '@angular/material/divider'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatToolbarModule } from '@angular/material/toolbar'
import { FilterSearchPipeModule } from '../../../pipes/filter-search/filter-search.module'
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
    // Ng2SearchPipeModule,
    TranslateModule,
    FilterSearchPipeModule,
  ],
  exports: [PublicContactComponent, TranslateModule],

})
export class PublicContactModule { }
