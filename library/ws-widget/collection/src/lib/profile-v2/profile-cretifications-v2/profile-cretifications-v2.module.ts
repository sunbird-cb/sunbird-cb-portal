import { NgModule } from '@angular/core'
import { ProfileCretificationsV2Component } from './profile-cretifications-v2.component'
import { BrowserModule } from '@angular/platform-browser'
import { ProfileCertificateDialogModule } from '../profile-certificate-dialog/profile-certificate-dialog.module'
import { PipePublicURLModule, DefaultThumbnailModule, PipeCertificateImageURLModule } from '@sunbird-cb/utils-v2'
import { TranslateModule } from '@ngx-translate/core'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips'
import { MatDividerModule } from '@angular/material/divider'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'

@NgModule({
    declarations: [ProfileCretificationsV2Component],
    imports: [
        BrowserModule,
        MatButtonModule,
        MatCardModule,
        MatChipsModule,
        DefaultThumbnailModule,
        MatDividerModule,
        MatExpansionModule,
        MatIconModule,
        MatProgressSpinnerModule,
        ProfileCertificateDialogModule,
        PipePublicURLModule,
        PipeCertificateImageURLModule,
        TranslateModule,
    ]
})
export class ProfileCretificationsV2Module {}
