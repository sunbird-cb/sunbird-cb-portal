import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgModule } from '@angular/core'

// import { AceEditorModule } from 'ng2-ace-editor'

import { DbmsBestPracticeComponent } from './components/dbms-best-practice/dbms-best-practice.component'
import { DbmsConceptCreateComponent } from './components/dbms-concept-create/dbms-concept-create.component'
import { DbmsConceptDropdownComponent } from './components/dbms-concept-dropdown/dbms-concept-dropdown.component'
import { DbmsExerciseComponent } from './components/dbms-exercise/dbms-exercise.component'
import { RdbmsHandsOnComponent } from './rdbms-hands-on.component'
import { DbmsPlaygroundComponent } from './components/dbms-playground/dbms-playground.component'
import { ExecutionResultComponent } from './components/execution-result/execution-result.component'
import { SubmissionDialogComponent } from './components/submission-dialog/submission-dialog.component'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list'
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar'
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select'
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar'
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table'
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs'

@NgModule({
    declarations: [
        DbmsBestPracticeComponent,
        DbmsConceptCreateComponent,
        DbmsConceptDropdownComponent,
        DbmsExerciseComponent,
        RdbmsHandsOnComponent,
        DbmsPlaygroundComponent,
        ExecutionResultComponent,
        SubmissionDialogComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatCardModule,
        MatInputModule,
        MatIconModule,
        MatProgressBarModule,
        MatTabsModule,
        MatSelectModule,
        MatButtonModule,
        MatTableModule,
        MatListModule,
        MatDialogModule,
        MatSnackBarModule,
        MatExpansionModule,
        // AceEditorModule,
    ],
    exports: [
        RdbmsHandsOnComponent,
    ]
})
export class RdbmsHandsOnModule { }
