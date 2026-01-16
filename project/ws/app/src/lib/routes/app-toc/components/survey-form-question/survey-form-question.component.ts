import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyInputModule } from '@angular/material/legacy-input';
import { MatLegacyRadioModule } from '@angular/material/legacy-radio';
import { MatLegacySelectModule } from '@angular/material/legacy-select';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ws-app-survey-form-question',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatLegacyRadioModule,
    MatLegacySelectModule,
    MatLegacyCheckboxModule,
    MatLegacyInputModule,
    MatDatepickerModule,
    MatIconModule,
    MatLegacySelectModule,
    ReactiveFormsModule, 
    FormsModule,
    MatFormFieldModule,
    TranslateModule
  ],
  templateUrl: './survey-form-question.component.html',
  styleUrls: ['./survey-form-question.component.scss']
})
export class SurveyFormQuestionComponent implements OnInit {
  @Input() questionForm!: FormGroup;
  @Input() fieldDetails: any

  @Output() questionValues = new EventEmitter()

  otherFieldType = ['radio', 'boolean', 'rating']
  stars = Array(5).fill(0)
  previesAnswer: string = ''

  ngOnInit(): void {
    if (this.questionForm) {
      this.answerControl.valueChanges.subscribe((value: any) => {
        if(value !==  this.previesAnswer && value !== null) {
          if(this.fieldDetails['fieldType'] === 'numeric') {
            let modifiedValue = value.replace(/[^0-9.]/g, ''); // Remove all non-numeric and non-decimal characters
            const decimalCount = (modifiedValue.match(/\./g) || []).length;
            if (decimalCount > 1) {
              modifiedValue = modifiedValue.replace(/\.$/, ''); // Remove the last decimal point
            }
            if(value !== modifiedValue) {
              this.answerControl.patchValue(modifiedValue)
            }
          }
          if (this.fieldDetails['validatorsArray'] && this.questionForm.controls.isNA.value) {
            this.answerControl.setValidators(this.fieldDetails['validatorsArray'])
            this.questionForm.controls.isNA.patchValue(false)
            this.answerControl.markAllAsTouched()
            this.answerControl.updateValueAndValidity()
          }
          this.questionForm.updateValueAndValidity()
          this.emitAnswer()
        }
        this.previesAnswer = value
      })
    }
  }

  get answerControl() {
    return this.questionForm.controls.answer
  }

  sectionChange() {
    if(this.questionForm.controls.isNA.value) {
      this.answerControl.reset()
      this.answerControl.clearValidators()
      const validatorsArray = this.fieldDetails['validatorsArray'] ? this.fieldDetails['validatorsArray'].filter((validator: any) => validator !== Validators.required) : []
      this.answerControl.setValidators(validatorsArray)
      this.answerControl.updateValueAndValidity()
      this.resetCheckboxes()
      this.emitAnswer()
    }
  }

  resetCheckboxes() {
    if(this.fieldDetails && this.fieldDetails.values) {
      this.fieldDetails.values.forEach((e: any) => {
        e['checked'] = false
      })
    }
  }

  setRating(rating: number) {
    if(this.answerControl) {
      this.answerControl.patchValue(rating)
      this.emitAnswer()
    }
  }

  checkboxClicked(event: any, index: number) {
    let checkedList = this.answerControl.value ? this.answerControl.value : []
    if(event.checked) {
      checkedList.push(event.source.value)
    } else {
      checkedList = checkedList.filter((e: any) => e !== event.source.value)
    }
    if(this.fieldDetails.values && this.fieldDetails.values[index]) {
      this.fieldDetails.values[index]['checked'] = event.checked
    }
    this.answerControl.patchValue(checkedList)
    this.answerControl.updateValueAndValidity()
    this.questionForm.updateValueAndValidity()
    this.emitAnswer()
  }

  emitAnswer() {
    const answerDetails = this.questionForm.value
    this.questionValues.emit(answerDetails)
  }
}
