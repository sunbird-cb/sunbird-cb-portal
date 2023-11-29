import { NgModule } from '@angular/core'
import { ProfileCretificationsV2Component } from './profile-cretifications-v2.component'
import {
  MatButtonModule, MatCardModule, MatChipsModule, MatDividerModule,
  MatExpansionModule, MatIconModule, MatProgressSpinnerModule,
} from '@angular/material'
import { BrowserModule } from '@angular/platform-browser'
import { ProfileCertificateDialogModule } from '../profile-certificate-dialog/profile-certificate-dialog.module'
import { PipePublicURLModule, PipeCertificateImageURLModule } from '@sunbird-cb/utils/src/public-api'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'
//import { HttpLoaderFactory } from 'src/app/app.module'
import { HttpClient } from '@angular/common/http'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'

// tslint:disable-next-line:function-name
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http)
}

@NgModule({
  declarations: [ProfileCretificationsV2Component],
  imports: [BrowserModule, MatButtonModule, MatCardModule, MatChipsModule,
    // tslint:disable-next-line:max-line-length
    MatDividerModule, MatExpansionModule, MatIconModule, MatProgressSpinnerModule, ProfileCertificateDialogModule, PipePublicURLModule, PipeCertificateImageURLModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    })],
  entryComponents: [ProfileCretificationsV2Component],
})
export class ProfileCretificationsV2Module {

}
