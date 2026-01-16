import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { LayoutModule } from '@angular/cdk/layout'

import { PipeSafeSanitizerModule } from '@sunbird-cb/utils-v2'
import {
  UserImageModule,
  DisplayContentTypeModule,
  BtnContentFeedbackV2Module,
} from '@sunbird-cb/collection'

import { MyFeedbackRoutingModule } from './my-feedback-routing.module'
import { HomeComponent } from './components/home/home.component'
import { FeedbackListComponent } from './components/feedback-list/feedback-list.component'
import { FeedbackThreadComponent } from './components/feedback-thread/feedback-thread.component'
import { FeedbackThreadItemComponent } from './components/feedback-thread-item/feedback-thread-item.component'
import { MyFeedbackService } from './services/my-feedback.service'
import { FeedbackFilterDialogComponent } from './components/feedback-filter-dialog/feedback-filter-dialog.component'
import { FeedbackTypeComponent } from './components/feedback-type/feedback-type.component'
import { FeedbackThreadHeaderComponent } from './components/feedback-thread-header/feedback-thread-header.component'
import { FeedbackSummaryResolver } from '../../resolvers/feedback-summary.resolver'
import { FeedbackConfigResolver } from '../../resolvers/feedback-config.resolver'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox'
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips'
import { MatRippleModule } from '@angular/material/core'
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog'
import { MatDividerModule } from '@angular/material/divider'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list'
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select'
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle'
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar'
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'
import { MatBadgeModule } from '@angular/material/badge'

@NgModule({
    declarations: [
        HomeComponent,
        FeedbackListComponent,
        FeedbackThreadComponent,
        FeedbackThreadItemComponent,
        FeedbackFilterDialogComponent,
        FeedbackTypeComponent,
        FeedbackThreadHeaderComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        LayoutModule,
        MatListModule,
        MatIconModule,
        MatDividerModule,
        MatRippleModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        MatTooltipModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatBadgeModule,
        MatTabsModule,
        MatSnackBarModule,
        MatCheckboxModule,
        MatChipsModule,
        MatMenuModule,
        PipeSafeSanitizerModule,
        UserImageModule,
        DisplayContentTypeModule,
        BtnContentFeedbackV2Module,
        MyFeedbackRoutingModule,
    ],
    providers: [MyFeedbackService, FeedbackSummaryResolver, FeedbackConfigResolver]
})
export class MyFeedbackModule {}
