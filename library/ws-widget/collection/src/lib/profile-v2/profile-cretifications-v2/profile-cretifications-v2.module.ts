import { NgModule } from '@angular/core'
import { ProfileCretificationsV2Component } from './profile-cretifications-v2.component'
import {
  MatButtonModule, MatCardModule, MatChipsModule, MatDividerModule,
  MatExpansionModule, MatIconModule, MatProgressSpinnerModule,
} from '@angular/material'
import { BrowserModule } from '@angular/platform-browser'
import { ProfileCertificateDialogModule } from '../profile-certificate-dialog/profile-certificate-dialog.module'
import { PipePublicURLModule, DefaultThumbnailModule, PipeCertificateImageURLModule } from '@sunbird-cb/utils/src/public-api'
import { TranslateModule } from '@ngx-translate/core'

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
  ],
  entryComponents: [ProfileCretificationsV2Component],
})
export class ProfileCretificationsV2Module {}
