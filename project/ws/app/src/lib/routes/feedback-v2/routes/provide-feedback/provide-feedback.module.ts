import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { BtnContentFeedbackV2Module } from '@sunbird-cb/collection'
import { FeedbackApiService } from '../../apis/feedback-api.service'
import { FeedbackConfigResolver } from '../../resolvers/feedback-config.resolver'
import { FeedbackSummaryResolver } from '../../resolvers/feedback-summary.resolver'
import { ContentRequestComponent } from './components/content-request/content-request.component'
import { FeedbackComponent } from './components/feedback/feedback.component'
import { HomeComponent } from './components/home/home.component'
import { ServiceRequestComponent } from './components/service-request/service-request.component'
import { ProvideFeedbackRoutingModule } from './provide-feedback-routing.module'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar'
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs'
import { MatBadgeModule } from '@angular/material/badge'
@NgModule({
  declarations: [
    HomeComponent,
    FeedbackComponent,
    ContentRequestComponent,
    ServiceRequestComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProvideFeedbackRoutingModule,
    BtnContentFeedbackV2Module,
    MatButtonModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatBadgeModule,
  ],
  providers: [FeedbackApiService, FeedbackSummaryResolver, FeedbackConfigResolver],
})
export class ProvideFeedbackModule { }
