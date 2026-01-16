import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SocialSearchComponent } from './social-search.component'
import { FormsModule } from '@angular/forms'

import { RouterModule } from '@angular/router'
import { SocialSearchRoutingModule } from './social-search-routing.module'

import { BtnPageBackModule, BtnSocialVoteModule, BtnSocialLikeModule } from '@sunbird-cb/collection'
import { ForumHandlerService } from '../forums/service/EmitterService/forum-handler.service'
import { SearchFilterDisplayComponent } from './widgets/search-filter-display/search-filter-display.component'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox'
import { MatRippleModule } from '@angular/material/core'
import { MatDividerModule } from '@angular/material/divider'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list'
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs'
import { MatToolbarModule } from '@angular/material/toolbar'

@NgModule({
  declarations: [SocialSearchComponent, SearchFilterDisplayComponent],
  imports: [
    FormsModule,
    CommonModule,
    MatIconModule,
    MatRadioModule,
    MatCardModule,
    BtnSocialVoteModule,
    BtnSocialLikeModule,
    SocialSearchRoutingModule,
    MatProgressSpinnerModule,
    BtnPageBackModule,
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatMenuModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatListModule,
    RouterModule,
    MatTabsModule,
    MatButtonToggleModule,
    MatDividerModule,

  ],
  providers: [ForumHandlerService],
  exports: [SocialSearchComponent],
})
export class SocialSearchModule {
  constructor() {
    // console.log('Social Search Module Called')
  }

}
