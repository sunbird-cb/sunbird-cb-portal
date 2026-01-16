import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DialogSocialActivityUserComponent } from './dialog-social-activity-user.component'
import { UserImageModule } from '../../../_common/user-image/user-image.module'
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog'
import { MatDividerModule } from '@angular/material/divider'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs'

@NgModule({
    declarations: [DialogSocialActivityUserComponent],
    imports: [
        CommonModule,
        MatTabsModule,
        MatDividerModule,
        MatIconModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        UserImageModule,
    ]
})
export class DialogSocialActivityUserModule { }
