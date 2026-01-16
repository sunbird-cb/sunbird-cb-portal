import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FeedListComponent } from './feed-list.component'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { RouterModule } from '@angular/router'
import {
  GridLayoutModule, SlidersModule, DiscussStripMultipleModule,
  NetworkStripMultipleModule, ContentStripWithTabsModule, AvatarPhotoModule,
} from '@sunbird-cb/collection'
import { ContentStripWithTabsLibModule, ContentStripWithTabsPillsModule, ContentStripWithTabsPillsNewModule } from '@sunbird-cb/consumption'

@NgModule({
  declarations: [FeedListComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    GridLayoutModule,
    SlidersModule,
    DiscussStripMultipleModule,
    NetworkStripMultipleModule,
    ContentStripWithTabsModule,
    AvatarPhotoModule,
    ContentStripWithTabsLibModule,
    ContentStripWithTabsPillsModule,
    ContentStripWithTabsPillsNewModule,
  ],
  exports: [FeedListComponent]
})
export class FeedListModule { }