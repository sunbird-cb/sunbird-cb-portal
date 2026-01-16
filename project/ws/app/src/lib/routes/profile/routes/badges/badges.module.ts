import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BadgesComponent } from './badges.component'

import { BadgesCardComponent } from './components/badges-card/badges-card.component'
import { BadgesShareDialogComponent } from './components/badges-share-dialog/badges-share-dialog.component'
import { BadgesNotEarnedComponent } from './components/badges-not-earned/badges-not-earned.component'
import { HorizontalScrollerModule, DefaultThumbnailModule } from '@sunbird-cb/utils-v2'
import { BtnLinkedinShareModule, BtnFacebookShareModule, BtnTwitterShareModule } from '@sunbird-cb/collection'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu'
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar'
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'

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
    ]
})
export class BadgesModule { }
