import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

// import { AceEditorModule } from 'ng2-ace-editor'

import { PipeSafeSanitizerModule, PipeDurationTransformModule } from '@sunbird-cb/utils-v2'
import { CompletionSpinnerModule } from '@sunbird-cb/collection'

import { HandsOnComponent } from './hands-on.component'
import { HandsOnDialogComponent } from './components/hands-on-dialog/hands-on-dialog.component'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'
@NgModule({
    declarations: [HandsOnComponent, HandsOnDialogComponent],
    imports: [
        CommonModule,
        MatCardModule,
        MatIconModule,
        MatProgressBarModule,
        MatExpansionModule,
        MatButtonModule,
        MatDialogModule,
        // AceEditorModule,
        MatProgressSpinnerModule,
        PipeSafeSanitizerModule,
        PipeDurationTransformModule,
        CompletionSpinnerModule,
    ],
    exports: [
        HandsOnComponent,
    ]
})
export class HandsOnModule { }
