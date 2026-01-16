import { NgModule } from '@angular/core'
import { CommonModule, DatePipe } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { RouterModule } from '@angular/router'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'

import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete'
import { MatGridListModule } from '@angular/material/grid-list'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatDividerModule } from '@angular/material/divider'
import { SkeletonLoaderModule } from '@sunbird-cb/collection/src/lib/_common/skeleton-loader/skeleton-loader.module'

import { HttpLoaderFactory } from 'src/app/app.module'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
import { PipeFilterModule, PipeHtmlTagRemovalModule, PipeOrderByModule, PipeRelativeTimeModule, PipeCertificateImageURL } from '@sunbird-cb/utils-v2'
import { AvatarPhotoModule, BtnPageBackModule } from '@sunbird-cb/collection'
import { ProfileV2RoutingModule } from './profile-v2.rounting.module'
import { DiscussModule } from '../discuss/discuss.module'
import { EditorSharedModule } from '@ws/author/src/lib/routing/modules/editor/shared/shared.module'
import { ProfileCertificateDialogModule } from './components/profile-certificate-dialog/profile-certificate-dialog.module'
import { ProfileCardStatsModule } from '@sunbird-cb/collection/src/lib/_common/profile-card-stats/profile-card-stats.module'
import { WeeklyClapsModule } from '@sunbird-cb/collection/src/lib/_common/weekly-claps/weekly-claps.module'
import { UpdatePostsModule } from '@sunbird-cb/collection/src/lib/_common/update-posts/update-posts.module'
import { DiscussionsModule } from '@sunbird-cb/collection/src/lib/_common/discussions/discussions.module'
import { RecentRequestsModule } from '@sunbird-cb/collection/src/lib/_common/recent-requests/recent-requests.module'
import { PendingRequestModule } from '@sunbird-cb/collection/src/lib/_common/pending-request/pending-request.module'
import { UserLeaderboardModule } from '@sunbird-cb/collection/src/lib/_common/user-leaderboard/user-leaderboard.module'

import { LeftMenuComponent } from './components/left-menu/left-menu.component'
import { RightMenuComponent } from './components/right-menu/right-menu.component'
import { ProfileComponent } from './routes/profile/profile.component'
import { ProfileViewComponent } from './routes/profile-view/profile-view.component'
import { ProfileKarmapointsComponent } from './routes/profile-karmapoints/profile-karmapoints.component'
import { VerifyOtpComponent } from './components/verify-otp/verify-otp.component'
import { TransferRequestComponent } from './components/transfer-request/transfer-request.component'
import { WithdrawRequestComponent } from './components/withdraw-request/withdraw-request.component'
import { DesignationRequestComponent } from './components/designation-request/designation-request.component'

import { LoaderService } from '@ws/author/src/lib/services/loader.service'
import { InitResolver } from './resolvers/init-resolve.service'
import { OtpService } from '../user-profile/services/otp.services'
import { RejectionReasonPopupComponent } from './components/rejection-reason-popup/rejection-reason-popup.component'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list'
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'
import { ProfileViewV2Component } from './routes/profile-view-v2/profile-view-v2.component'
import { UserStatsComponent } from './components/profile-revamp/user-stats/user-stats.component'
import { AchievementsComponent } from './components/profile-revamp/achievements/achievements.component'
import { CompetenciesComponent } from './components/profile-revamp/competencies/competencies.component'
import { EducationalQualificationsComponent } from './components/profile-revamp/educational-qualifications/educational-qualifications.component'
import { ServiceHistoryComponent } from './components/profile-revamp/service-history/service-history.component'
import { MatLegacyMenuModule } from '@angular/material/legacy-menu'
import { CoverPhotoEditPopupComponent } from './components/profile-revamp/cover-photo-edit-popup/cover-photo-edit-popup.component'
import { PeopleSuggestionsComponent } from './components/profile-revamp/people-suggestions/people-suggestions.component'
import { ImageCropperModule } from 'ngx-image-cropper'
import { PrfileEditV2Component } from './revamp-dialogs/prfile-edit-v2/prfile-edit-v2.component'
import { ProfilePrimaryDetailsComponent } from './components/profile-revamp/profile-primary-details/profile-primary-details.component'
import { ProfileEntryEditComponent } from './revamp-dialogs/profile-entry-edit/profile-entry-edit.component'
import { MatLegacyCheckboxModule } from '@angular/material/legacy-checkbox'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { CertificateViewPopupComponent } from './components/profile-revamp/certificate-view-popup/certificate-view-popup.component'
import { SearchV3Module } from '../search-v3/search-v3.module'
import { CommunitySuggestionsModule, DialogComponentsModule } from '@sunbird-cb/consumption'
import { DescriptionComponent } from './components/profile-revamp/description/description.component'

import { CustomFieldsComponent } from './routes/custom-fields/custom-fields.component';
import { ViewCustomFieldsComponent } from './routes/view-custom-fields/view-custom-fields.component'
@NgModule({
    declarations: [
        ProfileComponent,
        ProfileViewComponent,
        ProfileKarmapointsComponent,
        LeftMenuComponent,
        RightMenuComponent,
        VerifyOtpComponent,
        TransferRequestComponent,
        WithdrawRequestComponent,
        DesignationRequestComponent,
        RejectionReasonPopupComponent,
        ProfileViewV2Component,
        UserStatsComponent,
        ServiceHistoryComponent,
        EducationalQualificationsComponent,
        CompetenciesComponent,
        AchievementsComponent,
        CoverPhotoEditPopupComponent,
        PeopleSuggestionsComponent,
        PrfileEditV2Component,
        ProfilePrimaryDetailsComponent,
        ProfileEntryEditComponent,
        CertificateViewPopupComponent,
        CertificateViewPopupComponent,
        DescriptionComponent,
        CustomFieldsComponent,
        ViewCustomFieldsComponent
    ],
    imports: [
        CommonModule,
        WidgetResolverModule,
        ReactiveFormsModule,
        ProfileV2RoutingModule,
        DiscussModule,
        FormsModule,
        RouterModule,
        MatGridListModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatDividerModule,
        MatIconModule,
        MatCardModule,
        MatChipsModule,
        MatListModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatInputModule,
        MatDialogModule,
        MatButtonModule,
        MatSidenavModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        PipeFilterModule,
        PipeHtmlTagRemovalModule,
        PipeRelativeTimeModule,
        AvatarPhotoModule,
        EditorSharedModule,
        PipeOrderByModule,
        BtnPageBackModule,
        WidgetResolverModule,
        ProfileCertificateDialogModule,
        MatTabsModule,
        SkeletonLoaderModule,
        ProfileCardStatsModule,
        WeeklyClapsModule,
        UserLeaderboardModule,
        UpdatePostsModule,
        DiscussionsModule,
        RecentRequestsModule,
        PendingRequestModule,
        MatTooltipModule,
        MatDatepickerModule,
        MatAutocompleteModule,
        TranslateModule,
        MatLegacyMenuModule,
        ImageCropperModule,
        MatLegacyCheckboxModule,
        DragDropModule,
        SearchV3Module,
        CommunitySuggestionsModule,
        DialogComponentsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
    ],
    providers: [
        LoaderService,
        InitResolver,
        OtpService,
        PipeCertificateImageURL,
        PrfileEditV2Component,
        ProfileEntryEditComponent,
        ServiceHistoryComponent,
        EducationalQualificationsComponent,
        AchievementsComponent,
        DatePipe
    ]
})
export class ProfileV2Module {

}
