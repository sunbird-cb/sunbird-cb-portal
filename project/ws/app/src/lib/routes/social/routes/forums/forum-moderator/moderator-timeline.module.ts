import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
// tslint:disable-next-line: max-line-length

import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog'
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list'
import { RouterModule } from '@angular/router'
import { BtnPageBackModule, BtnSocialLikeModule, BtnSocialVoteModule } from '@sunbird-cb/collection'
import { BtnModeratorModule } from '../widgets/buttons/btn-moderator/btn-moderator.module'
import { DialogBoxModeratorModule } from '../widgets/Dialog-Box/dialog-box-moderator/dialog-box-moderator.module'
import { ModeratorTimelineComponent } from './components/moderator-timeline.component'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'
import { MatToolbarModule } from '@angular/material/toolbar'
@NgModule({
    declarations: [ModeratorTimelineComponent],
    imports: [
        CommonModule,
        MatToolbarModule,
        MatIconModule,
        MatMenuModule,
        BtnSocialLikeModule,
        RouterModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        BtnPageBackModule,
        BtnPageBackModule,
        BtnSocialVoteModule,
        BtnSocialLikeModule,
        DialogBoxModeratorModule,
        MatButtonModule,
        MatDialogModule,
        MatExpansionModule,
        MatChipsModule,
        MatFormFieldModule,
        BtnModeratorModule,
        MatListModule,
        MatDialogModule,
    ],
    exports: [ModeratorTimelineComponent]
})
export class ModeratorTimelineModule { }
