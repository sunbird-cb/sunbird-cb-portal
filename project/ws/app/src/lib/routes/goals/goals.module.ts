import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import {
  BtnPageBackModule,
  DisplayContentTypeModule,
  PickerContentModule,
  EmailInputModule,
  DisplayContentsModule,
  UserAutocompleteModule,
  BtnLinkedinShareModule,
  BtnFacebookShareModule,
  BtnTwitterShareModule,
} from '@sunbird-cb/collection'
import { GoalsRoutingModule } from './goals-routing.module'
import { GoalDeleteDialogComponent } from './components/goal-delete-dialog/goal-delete-dialog.component'
import { GoalAcceptDialogComponent } from './components/goal-accept-dialog/goal-accept-dialog.component'
import { GoalRejectDialogComponent } from './components/goal-reject-dialog/goal-reject-dialog.component'
import { GoalCardComponent } from './components/goal-card/goal-card.component'
import { GoalCreateComponent } from './routes/goal-create/goal-create.component'
import { GoalTrackComponent } from './routes/goal-track/goal-track.component'
import { GoalHomeComponent } from './routes/goal-home/goal-home.component'
import { GoalNotificationComponent } from './routes/goal-notification/goal-notification.component'

import { GoalMeComponent } from './routes/goal-me/goal-me.component'
import { GoalOthersComponent } from './routes/goal-others/goal-others.component'
import { PipeDurationTransformModule } from '@sunbird-cb/utils-v2'
import { GoalCreateCommonComponent } from './components/goal-create-common/goal-create-common.component'
import { GoalCreateCustomComponent } from './components/goal-create-custom/goal-create-custom.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { GoalCommonCardComponent } from './components/goal-common-card/goal-common-card.component'
import { GoalTrackAcceptComponent } from './components/goal-track-accept/goal-track-accept.component'
import { GoalTrackRejectComponent } from './components/goal-track-reject/goal-track-reject.component'
import { GoalAcceptCardComponent } from './components/goal-accept-card/goal-accept-card.component'
import { GoalDeadlineTextComponent } from './components/goal-deadline-text/goal-deadline-text.component'
import { GoalShareDialogComponent } from './components/goal-share-dialog/goal-share-dialog.component'
import { GoalSharedDeleteDialogComponent } from './components/goal-shared-delete-dialog/goal-shared-delete-dialog.component'
import { GoalTrackPendingComponent } from './components/goal-track-pending/goal-track-pending.component'
import { NoAccessDialogComponent } from './components/no-access-dialog/no-access-dialog.component'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox'
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips'
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list'
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu'
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio'
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table'
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'

@NgModule({
    declarations: [
        GoalDeleteDialogComponent,
        GoalAcceptDialogComponent,
        GoalRejectDialogComponent,
        GoalCardComponent,
        GoalCreateComponent,
        GoalTrackComponent,
        GoalHomeComponent,
        GoalNotificationComponent,
        GoalMeComponent,
        GoalOthersComponent,
        GoalCreateCommonComponent,
        GoalCreateCustomComponent,
        GoalCommonCardComponent,
        GoalTrackAcceptComponent,
        GoalTrackRejectComponent,
        GoalAcceptCardComponent,
        GoalDeadlineTextComponent,
        GoalShareDialogComponent,
        GoalSharedDeleteDialogComponent,
        GoalTrackPendingComponent,
        NoAccessDialogComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        GoalsRoutingModule,
        BtnPageBackModule,
        DisplayContentTypeModule,
        DisplayContentsModule,
        PipeDurationTransformModule,
        EmailInputModule,
        PickerContentModule,
        PipeDurationTransformModule,
        // Material Imports
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonToggleModule,
        MatCardModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatListModule,
        MatIconModule,
        MatDialogModule,
        MatTooltipModule,
        MatToolbarModule,
        MatMenuModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatTabsModule,
        UserAutocompleteModule,
        MatChipsModule,
        MatCheckboxModule,
        MatTableModule,
        BtnLinkedinShareModule,
        BtnFacebookShareModule,
        BtnTwitterShareModule,
    ]
})
export class GoalsModule { }
