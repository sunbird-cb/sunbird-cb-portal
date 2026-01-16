//#region (imports)
import { Component, Inject, OnInit } from '@angular/core'
import { MatLegacySnackBar } from '@angular/material/legacy-snack-bar'
import { MAT_LEGACY_DIALOG_DATA, MatLegacyDialogRef } from '@angular/material/legacy-dialog'
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'
import * as _ from 'lodash'
import { AppTocService } from '../../services/app-toc.service'
import { HttpErrorResponse } from '@angular/common/http'
import { TranslateService } from '@ngx-translate/core'
//#endregion (imports)

const EMAIL_PATTERN = /^[a-zA-Z0-9]+[a-zA-Z0-9._-]*[a-zA-Z0-9]+@[a-zA-Z0-9]+([-a-zA-Z0-9]*[a-zA-Z0-9]+)?(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,4}$/
const MOBILE_PATTERN = /^[0]?[6789]\d{9}$/

@Component({
  selector: 'ws-app-completion-survey-form',
  templateUrl: './completion-survey-form.component.html',
  styleUrls: ['./completion-survey-form.component.scss']
})
export class CompletionSurveyFormComponent implements OnInit {

  //#region (properties)
  rating = 0
  stars = Array(5).fill(0)
  otherFieldType: any = []
  selectedOption = false
  formDetails: any
  surveyId = ''
  surveyForm!: FormGroup
  parentalFields: any[] = []
  childFields: any[] = []
  surveyFormIsValid = true
  addLoader = 0
  //#endregion (properties)

  //#region (constructor)
  constructor(
    private snackBar: MatLegacySnackBar,
    public dialogRef: MatLegacyDialogRef<CompletionSurveyFormComponent>,
    @Inject(MAT_LEGACY_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private appTocSvc: AppTocService,
    private translate: TranslateService,

  ) {
    this.surveyId = data.surveyId
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
  }
  //#endregion (constructor)


  //#region (initialization)
  ngOnInit(): void {
    this.getSurveyFormData()
  }

  getSurveyFormData() {
    this.addLoader = this.addLoader + 1
    this.appTocSvc.getFormById(this.surveyId).subscribe((result: any) => {
      this.addLoader = this.addLoader - 1
      this.formDetails = {
        title: _.get(result, 'result.response.title', ''),
        fields: _.get(result, 'result.response.fields', []),
        contextType: _.get(result, 'result.response.contextType', 'form'),
      }
      this.buildForm()
    }, (error: HttpErrorResponse) => {
      if (error) {
        this.addLoader = this.addLoader - 1
      }
    })
  }

  buildForm() {
    if (this.formDetails) {
      this.surveyForm = this.fb.group({
        fields: this.fb.array([])
      })
      const questionsArray = this.questionsArray
      if (this.formDetails.fields) {
        this.formDetails.fields.forEach((field: any) => {
          if (field.fieldType !== 'separator' && field.fieldType !== 'heading') {
            const validatorsArray: any = []
            if (field.isRequired) {
              validatorsArray.push(Validators.required)
            }

            switch (field.fieldType) {
              case 'phone number':
                validatorsArray.push(Validators.pattern(MOBILE_PATTERN))
                validatorsArray.push(Validators.minLength(10))
                validatorsArray.push(Validators.maxLength(10))
                break
              case 'email':
                validatorsArray.push(Validators.pattern(EMAIL_PATTERN))
                break
              case 'numeric':
                break
            }

            const questionGroup = this.fb.group({
              question: [field.name],
              parentId: [field.parentId],
              questionIndex: [questionsArray.length],
              fieldType: [field.fieldType],
              answer: ['', validatorsArray],
              isNA: [false],
              questionId: [field.id]
            })
            field['controlIndex'] = questionsArray.length
            field['validatorsArray'] = validatorsArray
            questionsArray.push(questionGroup)
            if (validatorsArray.length) {
              this.surveyFormIsValid = false
            }
          }

          if (field.parentId) {
            this.childFields.push(field)
          } else {
            this.parentalFields.push(field)
          }
        })
      }
    }
  }

  get questionsArray(): FormArray {
    if (this.surveyForm && this.surveyForm.controls.fields) {
      return this.surveyForm.controls.fields as FormArray
    }
    return this.fb.array([])
  }
  //#endregion (initialization)

  //#region (UI Interactions)
  getChildQuestionsFormArray(sectionId: string): FormArray {
    if (this.surveyForm && this.surveyForm.controls.fields) {
      const questionsArray = this.questionsArray
      const childQuestionsArray = questionsArray.controls.filter((question: any) => {
        return question.value && question.value.parentId === sectionId
      })

      if (childQuestionsArray.length > 0) {
        return this.fb.array(childQuestionsArray)
      }
    }
    return this.fb.array([]) as FormArray
  }

  getChildFields(sectionId: string) {
    let sectionChilds: any = []
    if (this.childFields) {
      sectionChilds = this.childFields.filter((field: any) => field.parentId === sectionId)
    }
    return sectionChilds
  }

  getQuestionControl(index: number) {
    if (this.questionsArray.controls[index]) {
      return this.questionsArray.controls[index]
    }
    return this.fb.group({})
  }

  submitForm() {
    this.surveyForm.markAllAsTouched()
    this.surveyForm.updateValueAndValidity()
    if (this.surveyFormIsValid) {
      const formBody: any = {
        formId: this.surveyId,
        version: 4,
        status: 'SUBMITTED',
        responses: this.dataObject,
        contextType: _.get(this.formDetails, 'contextType', ''),
        contextId: _.get(this.data, 'courseID', ''),
        contextName: _.get(this.data, 'courseName', ''),
        contextOrgId: _.get(this.data, 'contextOrgId', '')
      }

      this.addLoader = this.addLoader + 1
      this.appTocSvc.submitForm(formBody).subscribe({
        next: res => {
          this.addLoader = this.addLoader - 1
          if (_.get(res, 'params.status') === 'success') {
            this.openSnackbar('Form is submitted successfully')
            this.dialogRef.close(true)
          } else {
            this.openSnackbar(_.get(res, 'errorMessage', 'Something went wrong please try again'))
          }
        },
        error: (error: HttpErrorResponse) => {
          this.addLoader = this.addLoader - 1
          if (error) {
            this.openSnackbar('Something went wrong please try again')
          }
        }
      })
    }
  }

  //#region (data processing)
  get dataObject(): any {
    const dataObject: any = []
    const fields = _.get(this.surveyForm, 'value.fields', [])
    if (fields) {
      fields.forEach((field: any) => {
        let value = field.isNA ? 'N/A' : field.answer
        if (!field.isNA && field.fieldType === 'date' && value) {
          const formattedYear = value.getFullYear()
          const formattedMonth = String(value.getMonth() + 1).padStart(2, '0')
          const formattedDay = String(value.getDate()).padStart(2, '0')
          value = `${formattedYear}-${formattedMonth}-${formattedDay}`
        }
        dataObject.push({
          questionId: field.questionId,
          question: field.question,
          answer: value,
          answerType: field.fieldType
        })
      })
    }
    return dataObject
  }

  doItLater() {
    this.dialogRef.close(false)
  }
  //#endregion (data processing)

  updateQuestionValues(event: any) {
    this.questionsArray.value[event.questionIndex] = event
    this.updateSurveyFormValidity()
  }

  updateSurveyFormValidity() { // some times reactive forms not abale to detect value changes and validity in dynamic formArray
    this.surveyFormIsValid = true
    this.questionsArray.controls.forEach((form: any) => {
      if (!form.controls.answer.valid) {
        this.surveyFormIsValid = false
      }
    })
  }
  //#endregion (UI Interactions)





  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }

}
