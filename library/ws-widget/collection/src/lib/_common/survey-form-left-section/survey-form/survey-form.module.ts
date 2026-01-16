import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SurveyFormSectionComponent } from './survey-form-section/survey-form-section.component'
import { MatIconModule } from '@angular/material/icon'
import { TranslateModule } from '@ngx-translate/core'

@NgModule({
  declarations: [SurveyFormSectionComponent],
  imports: [
    CommonModule,
    MatIconModule,
    TranslateModule,
  ],
  exports: [SurveyFormSectionComponent],
})
export class SurveyFormModule { }
