import { Component, OnInit, Inject } from '@angular/core'
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { AppTocService } from '../../services/app-toc.service'
import * as _ from 'lodash'
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'
// import { DatePipe } from '@angular/common'
import { HttpErrorResponse } from '@angular/common/http'


const EMAIL_PATTERN = /^[a-zA-Z0-9]+[a-zA-Z0-9._-]*[a-zA-Z0-9]+@[a-zA-Z0-9]+([-a-zA-Z0-9]*[a-zA-Z0-9]+)?(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,4}$/
const MOBILE_PATTERN = /^[0]?[6789]\d{9}$/

@Component({
  selector: 'ws-app-enroll-questionnaire',
  templateUrl: './enroll-questionnaire.component.html',
  styleUrls: ['./enroll-questionnaire.component.scss'],
})

export class EnrollQuestionnaireComponent implements OnInit {
  public afterSubmitAction = this.checkAfterSubmit.bind(this)
  isReadOnly = false

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
  wfClientVersion = "0"

  constructor(
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<EnrollQuestionnaireComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private appTocSvc: AppTocService,
    private fb: FormBuilder,
    // private datePipe: DatePipe
  ) {
    this.surveyId = data.surveyId
    this.wfClientVersion = data.wfClientVersion.toLocaleString()
  }

  public checkAfterSubmit(_e: any) {
    // this.renderSubject.next()
    // tslint:disable-next-line:no-console
    console.log('Form is submitted successfully')
    this.openSnackbar('Form is submitted successfully')
    this.dialogRef.close(true)
  }

  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }

  ngOnInit() {
    if (this.wfClientVersion === '1.1') {
      this.getFormDetails()
      this.otherFieldType = ['radio', 'boolean', 'rating']
    }
  }

  getFormDetails() {
    this.addLoader = this.addLoader + 1
    this.appTocSvc.getFormById(this.surveyId).subscribe((result: any) => {
      this.addLoader = this.addLoader - 1
      this.formDetails = {
        title: _.get(result, 'result.response.title', ''),
        fields: _.get(result, 'result.response.fields', [])
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

  getChildQuestionsFormArray(sectionId: string): FormArray {
    if (this.surveyForm && this.surveyForm.controls.fields) {
      const questionsArray = this.questionsArray
      const childQuestionsArray = questionsArray.controls.filter((question: any) => {
        return question.value && question.value.parentId === sectionId;
      });

      if (childQuestionsArray.length > 0) {
        return this.fb.array(childQuestionsArray);
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

  closeForm() {
    this.dialogRef.close()
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
        contextId: _.get(this.data, 'batchData.courseId'),
        contextName: _.get(this.data, 'courseName', ''),
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

}
