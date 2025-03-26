import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    MatTooltipModule,
    MatTabsModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressBarModule,
    MatListModule,
    MatDialogModule,
    MatRadioModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
} from '@angular/material'
import { PublicTocComponent } from './public-toc.component'
import { RouterModule } from '@angular/router'
import { PipeDurationTransformModule, PipePartialContentModule, PipeSafeSanitizerModule } from '@sunbird-cb/utils-v2'
import { AppTocService } from '@ws/app/src/lib/routes/app-toc/services/app-toc.service'
import { AppTocModule } from '@ws/app/src/public-api'
import { BtnPageBackNavModule } from '@sunbird-cb/collection/src/public-api'

@NgModule({
    declarations: [PublicTocComponent],
    imports: [
        CommonModule,
        RouterModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        MatCardModule,
        MatTooltipModule,
        MatTabsModule,
        MatChipsModule,
        MatDividerModule,
        MatProgressBarModule,
        MatListModule,
        MatDialogModule,
        MatRadioModule,
        MatExpansionModule,
        MatProgressSpinnerModule,
        MatCheckboxModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatSnackBarModule,
        MatDatepickerModule,
        MatNativeDateModule,
        PipeSafeSanitizerModule,
        PipeDurationTransformModule,
        PipePartialContentModule,
        AppTocModule,
        BtnPageBackNavModule,
    ],
    exports: [PublicTocComponent],
    providers: [AppTocService],
    entryComponents: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PublicTocModule { }
