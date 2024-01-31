import { NgModule } from '@angular/core'
import { ProfileCareerComponent } from './profile-career.component'
import {
  MatButtonModule, MatCardModule, MatChipsModule, MatDividerModule,
  MatExpansionModule, MatIconModule, MatProgressSpinnerModule,
} from '@angular/material'
import { BrowserModule } from '@angular/platform-browser'
import { PipeRelativeTimeModule } from '@sunbird-cb/utils'
import { TranslateModule } from '@ngx-translate/core'

@NgModule({
  declarations: [ProfileCareerComponent],
  imports: [BrowserModule, MatButtonModule, MatCardModule, MatChipsModule,
    MatDividerModule, MatExpansionModule, MatIconModule, MatProgressSpinnerModule,
    PipeRelativeTimeModule,
    TranslateModule,
  ],
  entryComponents: [ProfileCareerComponent],
})
export class ProfileCareerModule {

}
