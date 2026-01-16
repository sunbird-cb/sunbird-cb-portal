import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs'
import { RouterModule } from '@angular/router'
import { BtnPageBackModule, BtnSocialLikeModule, BtnSocialVoteModule } from '@sunbird-cb/collection'
import { BtnAdminModule } from '../widgets/buttons/btn-admin/btn-admin.module'
import { BtnModeratorModule } from '../widgets/buttons/btn-moderator/btn-moderator.module'
import { DialogBoxAdminAcceptModule } from '../widgets/Dialog-Box/dialog-box-admin-accept/dialog-box-admin-accept.module'
import { DialogBoxModeratorModule } from '../widgets/Dialog-Box/dialog-box-moderator/dialog-box-moderator.module'
import { AdminTimelineComponent } from './components/admin-timeline.component'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips'
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list'
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'
import { MatToolbarModule } from '@angular/material/toolbar'

@NgModule({
    declarations: [AdminTimelineComponent],
    imports: [
        CommonModule,
        MatToolbarModule,
        MatIconModule,
        MatMenuModule,
        BtnSocialLikeModule,
        BtnAdminModule,
        RouterModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        MatTabsModule,
        BtnPageBackModule,
        BtnPageBackModule,
        BtnSocialVoteModule,
        BtnSocialLikeModule,
        DialogBoxModeratorModule,
        DialogBoxAdminAcceptModule,
        MatButtonModule,
        MatDialogModule,
        MatExpansionModule,
        MatChipsModule,
        MatFormFieldModule,
        BtnModeratorModule,
        MatListModule,
        MatDialogModule,
    ],
    exports: [AdminTimelineComponent]
})
export class AdminTimelineModule { }
