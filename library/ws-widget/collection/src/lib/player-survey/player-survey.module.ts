import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { BtnFullscreenModule } from '../btn-fullscreen/btn-fullscreen.module'
import { PlayerSurveyComponent } from './player-survey.component'
import { MicroSurveyModule } from '@sunbird-cb/micro-surveys'
import { TranslateModule } from '@ngx-translate/core'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu'
import { MatLegacySliderModule as MatSliderModule } from '@angular/material/legacy-slider'
import { MatToolbarModule } from '@angular/material/toolbar'
import { SurveyFormQuestionComponent } from '@ws/app/src/lib/routes/app-toc/components/survey-form-question/survey-form-question.component'
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio'
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select'
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'
import { SurveyFormSectionComponent } from '@ws/app/src/lib/routes/app-toc/components/survey-form-section/survey-form-section.component'



@NgModule({
    declarations: [PlayerSurveyComponent],
    imports: [
        CommonModule,
        MatInputModule,
        MatIconModule,
        MatFormFieldModule,
        MatMenuModule,
        MatButtonModule,
        MatSliderModule,
        MatToolbarModule,
        ReactiveFormsModule,
        FormsModule,
        BtnFullscreenModule,
        MatInputModule,
        MicroSurveyModule,
        MatRadioModule,
        MatSelectModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        SurveyFormQuestionComponent,
        SurveyFormSectionComponent,
        TranslateModule.forChild(),
    ],
    exports: [PlayerSurveyComponent]
})
export class PlayerSurveyModule { }
