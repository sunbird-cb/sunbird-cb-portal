import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { MatIconModule, MatTabsModule, MatProgressBarModule, MatExpansionModule } from '@angular/material'

import { AvatarPhotoModule } from '../avatar-photo/avatar-photo.module'
import { SkeletonLoaderModule } from '../skeleton-loader/skeleton-loader.module'
import { RatingSummaryModule } from '../rating-summary/rating-summary.module'

import { ContentTocComponent } from './content-toc.component'
import { AppTocAboutComponent } from './app-toc-about/app-toc-about.component'
import { AppTocContentComponent } from './app-toc-content/app-toc-content.component'

@NgModule({
  declarations: [ContentTocComponent, AppTocAboutComponent, AppTocContentComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatTabsModule,
    SkeletonLoaderModule,
    MatProgressBarModule,
    MatExpansionModule,
    AvatarPhotoModule,
    RatingSummaryModule,
  ],
  exports: [
    ContentTocComponent,
    AppTocAboutComponent,
    AppTocContentComponent,
  ],
  entryComponents: [
    ContentTocComponent,
  ],
})

export class ContentTocModule { }
