import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { HomeRoutingModule } from './home-routing.module'

import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatIconModule } from '@angular/material/icon'

import { HeaderModule } from '../header/header.module'
import {
  GridLayoutModule, SlidersModule, DiscussStripMultipleModule,
  NetworkStripMultipleModule, ContentStripWithTabsModule, AvatarPhotoModule,
} from '@sunbird-cb/collection'
import { SkeletonLoaderModule } from '@sunbird-cb/collection/src/lib/_common/skeleton-loader/skeleton-loader.module'
import { ProfileCardStatsModule } from '@sunbird-cb/collection/src/lib/_common/profile-card-stats/profile-card-stats.module'
import { PipeRelativeTimeModule, ImageResponsiveModule } from '@sunbird-cb/utils-v2'
import { WeeklyClapsModule } from '@sunbird-cb/collection/src/lib/_common/weekly-claps/weekly-claps.module'
import { TipsForLearnerModule } from '@sunbird-cb/collection/src/lib/_common/tips-for-learner/tips-for-learner.module'
import { UpdatePostsModule } from '@sunbird-cb/collection/src/lib/_common/update-posts/update-posts.module'
import { DiscussionsModule } from '@sunbird-cb/collection/src/lib/_common/discussions/discussions.module'
import { RecentRequestsModule } from '@sunbird-cb/collection/src/lib/_common/recent-requests/recent-requests.module'
import { SharedModule } from '../shared/shared.module'
import { FeedListModule } from './home/feed-list/feed-list.module'

import { HomeComponent } from './home/home.component'
import { DiscussionInfoComponent } from '../component/discussion-info/discussion-info.component'
import { PageContainerComponent } from '../component/page-container/page-container.component'
import { ClientSliderComponent } from '../component/client-slider/client-slider.component'
import { HomeOtherPortalModule } from '../component/home-other-portal/home-other-portal.module'
import { HomeContainerComponent } from '../component/home-container/home-container.component'
import { DiscussHubComponent } from './home/discuss-hub/discuss-hub.component'
import { NetworkHubComponent } from './home/network-hub/network-hub.component'
import { NotificationComponent } from './home/notification/notification.component'
import { SurveyFormComponent } from '../component/app-survey/survey-form/survey-form.component'

import { HomePageService } from '../services/home-page.service'
import { PendingRequestModule } from '@sunbird-cb/collection/src/lib/_common/pending-request/pending-request.module'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'
import { HttpLoaderFactory } from '../app.module'
import { HttpClient } from '@angular/common/http'
import { UserLeaderboardModule } from '@sunbird-cb/collection/src/lib/_common/user-leaderboard/user-leaderboard.module'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'
import { ContentStripWithTabsLibModule, ContentStripWithTabsPillsModule } from '@sunbird-cb/consumption'
import { SurveyFormModule } from '@sunbird-cb/collection/src/lib/_common/survey-form-left-section/survey-form/survey-form.module'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { SignupService } from '../routes/signup/signup.service'
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete'
import { MatDialogModule } from '@angular/material/dialog'
import { InSightSideBarModule } from '../component/in-sight-side-bar/in-sight-side-bar.module'
 

@NgModule({
    declarations: [
        HomeComponent,
        PageContainerComponent, DiscussionInfoComponent, ClientSliderComponent,
        HomeContainerComponent, DiscussHubComponent,
        NetworkHubComponent, NotificationComponent, SurveyFormComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        HomeRoutingModule,
        GridLayoutModule,
        SlidersModule,
        DiscussStripMultipleModule,
        NetworkStripMultipleModule,
        ContentStripWithTabsModule,
        MatCardModule,
        MatIconModule,
        SharedModule,
        ProfileCardStatsModule,
        UserLeaderboardModule,
        MatIconModule,
        WeeklyClapsModule,
        TipsForLearnerModule,
        UpdatePostsModule,
        DiscussionsModule,
        RecentRequestsModule,
        SkeletonLoaderModule,
        PipeRelativeTimeModule,
        ImageResponsiveModule,
        AvatarPhotoModule,
        PendingRequestModule,
        ContentStripWithTabsLibModule,
        ContentStripWithTabsPillsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatButtonModule,
        MatAutocompleteModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
        MatTooltipModule,
        SurveyFormModule,
        MatDialogModule,
        FeedListModule,
        InSightSideBarModule,
        HomeOtherPortalModule
    ],
    exports: [
        HeaderModule,
        MatCardModule,
        SharedModule,
        TranslateModule,
        FeedListModule,
        InSightSideBarModule,
        HomeOtherPortalModule
    ],
    providers: [
        HomePageService,
        SignupService,
    ]
})
export class HomeModule { }
