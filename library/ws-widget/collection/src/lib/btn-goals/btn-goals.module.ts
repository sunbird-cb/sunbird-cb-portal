import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { BtnGoalsComponent } from './btn-goals.component'
import { BtnGoalsDialogComponent } from './btn-goals-dialog/btn-goals-dialog.component'
import { BtnGoalsSelectionComponent } from './btn-goals-selection/btn-goals-selection.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { BtnGoalsErrorComponent } from './btn-goals-error/btn-goals-error.component'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list'
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'

@NgModule({
    declarations: [BtnGoalsComponent, BtnGoalsDialogComponent, BtnGoalsSelectionComponent, BtnGoalsErrorComponent],
    imports: [
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        MatListModule,
        MatDialogModule,
    ],
    exports: [BtnGoalsComponent]
})
export class BtnGoalsModule { }
