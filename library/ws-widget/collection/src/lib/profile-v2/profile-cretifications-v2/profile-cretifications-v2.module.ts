import { NgModule } from '@angular/core'
import { ProfileCretificationsV2Component } from './profile-cretifications-v2.component'
import {
  MatButtonModule, MatCardModule, MatChipsModule, MatDividerModule,
  MatExpansionModule, MatIconModule, MatProgressSpinnerModule,
} from '@angular/material'
import { BrowserModule } from '@angular/platform-browser'
import { ProfileCertificateDialogModule } from '../profile-certificate-dialog/profile-certificate-dialog.module'
import { PipePublicURLModule } from '@sunbird-cb/utils/src/public-api'
@NgModule({
  declarations: [ProfileCretificationsV2Component],
  imports: [BrowserModule, MatButtonModule, MatCardModule, MatChipsModule,
    MatDividerModule, MatExpansionModule, MatIconModule, MatProgressSpinnerModule, ProfileCertificateDialogModule, PipePublicURLModule],
  entryComponents: [ProfileCretificationsV2Component],
})
export class ProfileCretificationsV2Module {

}
