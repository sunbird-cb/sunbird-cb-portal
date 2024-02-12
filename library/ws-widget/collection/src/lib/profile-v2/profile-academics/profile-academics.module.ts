import { NgModule } from '@angular/core'
import { ProfileAcademicsComponent } from './profile-academics.component'
import {
  MatButtonModule, MatCardModule, MatChipsModule, MatDividerModule,
  MatExpansionModule, MatIconModule, MatProgressSpinnerModule,
} from '@angular/material'
import { BrowserModule } from '@angular/platform-browser'
import { PipeOrderByModule } from '@sunbird-cb/utils'

import { TranslateModule } from '@ngx-translate/core'

@NgModule({
  declarations: [ProfileAcademicsComponent],
  imports: [BrowserModule, MatButtonModule, MatCardModule, MatChipsModule,
    MatDividerModule, MatExpansionModule, MatIconModule, MatProgressSpinnerModule, PipeOrderByModule,
    TranslateModule,
  ],
  entryComponents: [ProfileAcademicsComponent],
})
export class ProfileAcademicsModule {

}
