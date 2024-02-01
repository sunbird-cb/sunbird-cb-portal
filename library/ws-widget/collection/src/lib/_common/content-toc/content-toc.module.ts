import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { MatIconModule, MatTabsModule, MatProgressBarModule, MatExpansionModule, MatMenuModule } from '@angular/material'

import { AvatarPhotoModule } from '../avatar-photo/avatar-photo.module'
import { SkeletonLoaderModule } from '../skeleton-loader/skeleton-loader.module'
import { RatingSummaryModule } from '../rating-summary/rating-summary.module'

import { ContentTocComponent } from './content-toc.component'
import { AppTocAboutComponent } from './app-toc-about/app-toc-about.component'
import { AppTocContentComponent } from './app-toc-content/app-toc-content.component'
import { ReviewsContentComponent } from './reviews-content/reviews-content.component'
import { AppTocContentCardV2Component } from './app-toc-content-card-v2/app-toc-content-card-v2.component'
import { PipeDurationTransformModule } from '@sunbird-cb/utils/src/public-api'
import { NgCircleProgressModule } from 'ng-circle-progress'
import { ContentProgressModule } from '../content-progress/content-progress.module'

@NgModule({
  declarations: [
    ContentTocComponent,
    AppTocAboutComponent,
    AppTocContentComponent,
    AppTocContentCardV2Component,
    ReviewsContentComponent,
  ],
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
    MatMenuModule,
    PipeDurationTransformModule,
    ContentProgressModule,
    NgCircleProgressModule.forRoot({}),
  ],
  exports: [
    ContentTocComponent,
    AppTocAboutComponent,
    AppTocContentComponent,
    ReviewsContentComponent,
  ],
  entryComponents: [
    ReviewsContentComponent,
  ],
})

export class ContentTocModule { }
