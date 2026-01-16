import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import {
  BtnPageBackModule,
  DisplayContentsModule,
  DisplayContentTypeModule,
  EmailInputModule,
  PickerContentModule,
  UserAutocompleteModule,
  UserImageModule,
} from '@sunbird-cb/collection'
import { DialogAssignComponent } from './components/dialog-assign/dialog-assign.component'
import {
  DialogUserRoleSelectComponent,
} from './components/dialog-user-role-select/dialog-user-role-select.component'
import { UserFilterDisplayComponent } from './components/user-filter-display/user-filter-display.component'
import { ContentAssignmentRoutingModule } from './content-assignment-routing.module'
import { ContentAssignmentGuard } from './guards/content-assignment.guard'
import { AssignmentDetailsComponent } from './routes/assignment-details/assignment-details.component'
import { ContentAssignmentComponent } from './routes/content-assignment/content-assignment.component'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox'
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips'
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MatGridListModule } from '@angular/material/grid-list'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list'
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu'
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator'
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio'
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatStepperModule } from '@angular/material/stepper'
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table'
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'

@NgModule({
    declarations: [
        ContentAssignmentComponent,
        UserFilterDisplayComponent,
        DialogAssignComponent,
        DialogUserRoleSelectComponent,
        AssignmentDetailsComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BtnPageBackModule,
        DisplayContentTypeModule,
        DisplayContentsModule,
        EmailInputModule,
        PickerContentModule,
        UserImageModule,
        // Material Imports
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonToggleModule,
        MatCardModule,
        MatGridListModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatListModule,
        MatIconModule,
        MatDialogModule,
        MatTooltipModule,
        MatToolbarModule,
        MatMenuModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatTabsModule,
        UserAutocompleteModule,
        MatChipsModule,
        MatCheckboxModule,
        MatTableModule,
        MatSidenavModule,
        MatStepperModule,
        MatSelectModule,
        ContentAssignmentRoutingModule,
    ],
    providers: [ContentAssignmentGuard]
})
export class ContentAssignmentModule { }
