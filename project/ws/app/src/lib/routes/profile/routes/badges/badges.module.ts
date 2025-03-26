import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BadgesComponent } from './badges.component'

import {
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatProgressBarModule,
  MatMenuModule,
} from '@angular/material'
import { BadgesCardComponent } from './components/badges-card/badges-card.component'
import { BadgesShareDialogComponent } from './components/badges-share-dialog/badges-share-dialog.component'
import { BadgesNotEarnedComponent } from './components/badges-not-earned/badges-not-earned.component'
import { HorizontalScrollerModule, DefaultThumbnailModule } from '@sunbird-cb/utils-v2'
import { BtnLinkedinShareModule, BtnFacebookShareModule, BtnTwitterShareModule } from '@sunbird-cb/collection'

@NgModule({
  declarations: [BadgesComponent, BadgesCardComponent, BadgesNotEarnedComponent, BadgesShareDialogComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatProgressBarModule,
    HorizontalScrollerModule,
    DefaultThumbnailModule,
    MatMenuModule,
    BtnLinkedinShareModule,
    BtnFacebookShareModule,
    BtnTwitterShareModule,
  ],
  entryComponents: [
    BadgesShareDialogComponent,
  ],
})
export class BadgesModule { }
