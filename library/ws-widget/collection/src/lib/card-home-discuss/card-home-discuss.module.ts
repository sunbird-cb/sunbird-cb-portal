import { NgModule } from '@angular/core'
import { CardHomeDiscussComponent } from './card-home-discuss.component'
import {
  MatButtonModule, MatCardModule, MatChipsModule, MatDividerModule,
  MatExpansionModule, MatIconModule, MatProgressSpinnerModule,
} from '@angular/material'
import { AvatarPhotoModule } from '../_common/avatar-photo/avatar-photo.module'
import { BrowserModule } from '@angular/platform-browser'
import { CardDiscussComponent } from '../card-discuss/card-discuss.component'
import { PipeRelativeTimeModule } from '@sunbird-cb/utils-v2'

@NgModule({
  declarations: [CardHomeDiscussComponent, CardDiscussComponent],
  imports: [BrowserModule, AvatarPhotoModule, MatButtonModule, MatCardModule, MatChipsModule,
    MatDividerModule, MatExpansionModule, MatIconModule, MatProgressSpinnerModule, PipeRelativeTimeModule],
  entryComponents: [CardHomeDiscussComponent],
})
export class CardHomeDiscussModule {

}
