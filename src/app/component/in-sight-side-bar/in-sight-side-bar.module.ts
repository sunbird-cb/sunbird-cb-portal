import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { InsightSideBarComponent } from './in-sight-side-bar.component'

// Material modules
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete'
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select'

// Sunbird CB Collection modules
import {
  AvatarPhotoModule,
  BtnPageBackModule,
  CardContentModule,
  ContentStripMultipleModule,
  ContentStripNewMultipleModule,
  DiscussStripMultipleModule,
  NetworkStripMultipleModule,
  UserImageModule
} from '@sunbird-cb/collection'

// Import WidgetResolverModule from the correct package
import { WidgetResolverModule } from '@sunbird-cb/resolver'

// Utilities from @sunbird-cb/utils-v2
import {
  PipeNameTransformModule,
  PipeRelativeTimeModule,
  ImageResponsiveModule,
  PipeLimitToModule,
  PipePartialContentModule,
  PipeDurationTransformModule,
  HorizontalScrollerModule,
  HorizontalScrollerV2Module
} from '@sunbird-cb/utils-v2'

// Import specific modules from collection (using full paths)
import { WeeklyClapsModule } from '@sunbird-cb/collection/src/lib/_common/weekly-claps/weekly-claps.module'
import { UpdatePostsModule } from '@sunbird-cb/collection/src/lib/_common/update-posts/update-posts.module'
import { RecentRequestsModule } from '@sunbird-cb/collection/src/lib/_common/recent-requests/recent-requests.module'
import { PendingRequestModule } from '@sunbird-cb/collection/src/lib/_common/pending-request/pending-request.module'
import { ProfileCardStatsModule } from '@sunbird-cb/collection/src/lib/_common/profile-card-stats/profile-card-stats.module'
import { UserLeaderboardModule } from '@sunbird-cb/collection/src/lib/_common/user-leaderboard/user-leaderboard.module'
import { DiscussionsModule } from '@sunbird-cb/collection/src/lib/_common/discussions/discussions.module'
import { TipsForLearnerModule } from '@sunbird-cb/collection/src/lib/_common/tips-for-learner/tips-for-learner.module'

// Import consumption modules
import { ContentStripWithTabsLibModule, ContentStripWithTabsPillsModule } from '@sunbird-cb/consumption'

// Import translate module
import { TranslateModule } from '@ngx-translate/core'

// Import home other portal module
import { HomeOtherPortalModule } from '../home-other-portal/home-other-portal.module'

@NgModule({
  declarations: [InsightSideBarComponent],
  imports: [
    // Angular modules
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    // Material modules
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,

    // Widget modules from @sunbird-cb/collection
    AvatarPhotoModule,
    BtnPageBackModule,
    CardContentModule,
    ContentStripMultipleModule,
    ContentStripNewMultipleModule,
    DiscussStripMultipleModule,
    NetworkStripMultipleModule,
    UserImageModule,
    WidgetResolverModule,
    
    // Specific collection modules with full paths
    WeeklyClapsModule,
    UpdatePostsModule,
    RecentRequestsModule,
    PendingRequestModule,
    ProfileCardStatsModule,
    UserLeaderboardModule,
    DiscussionsModule,
    TipsForLearnerModule,
    
    // Consumption modules
    ContentStripWithTabsLibModule,
    ContentStripWithTabsPillsModule,

    // Utility modules from @sunbird-cb/utils-v2
    PipeNameTransformModule,
    PipeRelativeTimeModule,
    ImageResponsiveModule,
    PipeLimitToModule,
    PipePartialContentModule,
    PipeDurationTransformModule,
    HorizontalScrollerModule,
    HorizontalScrollerV2Module,

    // Translate module
    TranslateModule,

    // Home other portal module
    HomeOtherPortalModule
  ],
  exports: [InsightSideBarComponent]
})
export class InSightSideBarModule { }