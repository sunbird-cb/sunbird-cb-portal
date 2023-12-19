import { NgModule } from '@angular/core'
import { CardHubsListComponent } from './card-hubs-list.component'
import { MatButtonModule, MatCardModule, MatChipsModule, MatDividerModule, MatExpansionModule, MatIconModule, MatProgressSpinnerModule } from '@angular/material'
import { BrowserModule } from '@angular/platform-browser'
import { AvatarPhotoModule } from '../_common/avatar-photo/avatar-photo.module'
import { HorizontalScrollerModule, PipeNameTransformModule, PipeOrderByModule } from '@sunbird-cb/utils'
import { RouterModule } from '@angular/router'
import { ClickOutsideDirective } from './clickoutside.directive'

@NgModule({
  declarations: [CardHubsListComponent,
    ClickOutsideDirective],
  imports: [BrowserModule, MatButtonModule, MatCardModule, MatChipsModule, MatDividerModule,
    MatExpansionModule, MatIconModule, MatProgressSpinnerModule, AvatarPhotoModule,
    HorizontalScrollerModule, PipeNameTransformModule, PipeOrderByModule, RouterModule],
  entryComponents: [CardHubsListComponent],
})
export class CardHubsListModule {

}
