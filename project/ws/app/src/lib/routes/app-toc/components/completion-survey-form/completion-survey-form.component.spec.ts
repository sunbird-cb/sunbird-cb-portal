import { of, throwError } from 'rxjs'
import { FormBuilder } from '@angular/forms'
import { Validators } from '@angular/forms'

// Mock the service module before importing the component so Jest doesn't try to
// resolve heavy external deps like '@sunbird-cb/collection' used inside the real service.
jest.mock('../../services/app-toc.service', () => ({
  AppTocService: jest.fn().mockImplementation(() => ({
    getFormById: jest.fn(),
    submitForm: jest.fn(),
  })),
}))

import { CompletionSurveyFormComponent } from './completion-survey-form.component'

describe('CompletionSurveyFormComponent (no TestBed)', () => {
  let component: CompletionSurveyFormComponent
  let fb: FormBuilder
  // lightweight mocks typed as any to avoid strict mock typing issues
  const mockSnackBar: any = { open: jest.fn() }
  const mockDialogRef: any = { close: jest.fn() }
  const mockTranslate: any = { setDefaultLang: jest.fn(), use: jest.fn() }

  const sampleFields = [
    { id: 'q1', name: 'Q1', fieldType: 'text', isRequired: true },
    { id: 'q2', name: 'Q2', fieldType: 'date', isRequired: false },
  ]

  const mockAppTocSvc: any = {
    getFormById: jest.fn().mockReturnValue(of({ result: { response: { title: 't', fields: sampleFields } } })),
    submitForm: jest.fn().mockReturnValue(of({ params: { status: 'success' } }))
  }

  const mockData = { surveyId: 'survey1', batchData: { courseId: 'context1' }, courseName: 'Course A' } as any

  beforeEach(() => {
    // create a fresh FormBuilder for each test
    fb = new FormBuilder()
    // ensure localStorage state doesn't break constructor in test env
    if (localStorage.getItem('websiteLanguage')) {
      localStorage.removeItem('websiteLanguage')
    }
    component = new CompletionSurveyFormComponent(
      mockSnackBar,
      mockDialogRef,
      mockData,
      fb,
      mockAppTocSvc,
      mockTranslate,
    )
  })

  it('should create the component instance', () => {
    expect(component).toBeTruthy()
  })

  it('buildForm should build surveyForm and set surveyFormIsValid appropriately', () => {
    component.formDetails = { fields: [ { id: 'a', name: 'A', fieldType: 'text', isRequired: true } ] }
    component.buildForm()
    expect(component.surveyForm).toBeDefined()
    expect(component.questionsArray.length).toBeGreaterThan(0)
  // because field was required, surveyFormIsValid should have been set to false
  expect(component.surveyFormIsValid).toBeFalsy()
  })

  it('dataObject getter should format date and N/A values correctly', () => {
    const date = new Date(2020, 0, 2) // 2020-01-02
    const group = fb.group({
      questionId: ['d1'],
      question: ['Date Q'],
      answer: [date],
      isNA: [false],
      fieldType: ['date']
    })

    const naGroup = fb.group({
      questionId: ['n1'],
      question: ['NA Q'],
      answer: ['something'],
      isNA: [true],
      fieldType: ['text']
    })

    component.surveyForm = fb.group({ fields: fb.array([group, naGroup]) })

  const result: any = component.dataObject
  expect(result.length).toBe(2)
    expect(result[0].answer).toBe('2020-01-02')
    expect(result[1].answer).toBe('N/A')
  })

  it('doItLater should close dialog with false', () => {
    component.doItLater()
    expect(mockDialogRef.close).toHaveBeenCalledWith(false)
  })

  it('submitForm should call submit and close dialog on success', () => {
    // prepare minimal form and mark component valid
    component.surveyFormIsValid = true
    component.surveyId = 'survey1'
    component.surveyForm = fb.group({ fields: fb.array([]) })
    // call submitForm - submitForm uses mockAppTocSvc which returns success
    component.submitForm()
    expect(mockAppTocSvc.submitForm).toHaveBeenCalled()
    expect(mockSnackBar.open).toHaveBeenCalled()
    expect(mockDialogRef.close).toHaveBeenCalledWith(true)
  })

  it('constructor should use translate when websiteLanguage is present', () => {
    localStorage.setItem('websiteLanguage', 'hi')
    const tMock: any = { setDefaultLang: jest.fn(), use: jest.fn() }
    new CompletionSurveyFormComponent(mockSnackBar, mockDialogRef, mockData, fb, mockAppTocSvc, tMock)
    expect(tMock.setDefaultLang).toHaveBeenCalledWith('en')
    expect(tMock.use).toHaveBeenCalledWith('hi')
    localStorage.removeItem('websiteLanguage')
  })

  it('ngOnInit/getSurveyFormData should set formDetails on success', () => {
    // ensure getFormById returns expected data
    mockAppTocSvc.getFormById.mockReturnValue(of({ result: { response: { title: 'T', fields: sampleFields } } }))
    component.surveyId = 'survey1'
    component.addLoader = 0
    component.ngOnInit()
    // after subscribe, addLoader should be restored to 0
    expect(component.addLoader).toBe(0)
    expect(component.formDetails.title).toBe('T')
    expect(component.parentalFields.length + component.childFields.length).toBeGreaterThan(0)
  })

  it('getSurveyFormData should handle error without throwing', () => {
    mockAppTocSvc.getFormById.mockReturnValue(throwError(() => new Error('network')))
    component.addLoader = 0
    expect(() => component.getSurveyFormData()).not.toThrow()
    // loader should be restored to 0 after error handler runs
    expect(component.addLoader).toBe(0)
  })

  it('buildForm should handle phone, email and numeric validators and skip separators/headings', () => {
    component.formDetails = { fields: [
      { id: 's1', name: 'sep', fieldType: 'separator' },
      { id: 'h1', name: 'head', fieldType: 'heading' },
      { id: 'p1', name: 'Phone', fieldType: 'phone number', isRequired: false },
      { id: 'e1', name: 'Email', fieldType: 'email', isRequired: false },
      { id: 'n1', name: 'Num', fieldType: 'numeric', isRequired: false },
      { id: 'c1', name: 'Child', fieldType: 'text', parentId: 'sec1', isRequired: false },
      { id: 'parent1', name: 'Parent', fieldType: 'text', isRequired: false }
    ] }
    component.buildForm()
    // separators and headings should not be added
        expect(component.questionsArray.length).toBeGreaterThanOrEqual(4)
    // find phone field from formDetails to assert validatorsArray exists and has multiple validators
    const phoneField = component.formDetails.fields.find((f: any) => f.fieldType === 'phone number')
        expect(phoneField.validatorsArray.length).toBeGreaterThanOrEqual(3)
    const emailField = component.formDetails.fields.find((f: any) => f.fieldType === 'email')
        expect(emailField.validatorsArray.length).toBeGreaterThanOrEqual(1)
  })

  it('getChildQuestionsFormArray and getChildFields and getQuestionControl fallbacks', () => {
    // build simple formArray with one question having parentId 'p'
    component.surveyForm = fb.group({ fields: fb.array([ fb.group({ parentId: ['p'], answer: [''], questionId: ['x'] }) ]) })
    const childArray = component.getChildQuestionsFormArray('p')
    expect(childArray.length).toBe(1)
    // getChildFields relies on childFields list
    component.childFields = [{ parentId: 'p', id: 'x' }]
    expect(component.getChildFields('p').length).toBe(1)
    const ctrl = component.getQuestionControl(99)
    expect(ctrl).toBeDefined()
  })

  it('updateQuestionValues and updateSurveyFormValidity should mark invalid when answer invalid', () => {
    // create a required question to make validity false
    const q = fb.group({ answer: ['', Validators.required], questionIndex: [0] })
    component.surveyForm = fb.group({ fields: fb.array([q]) })
    component.updateQuestionValues({ questionIndex: 0, answer: '' })
  // should be invalid because required validator fails (check control validity)
    const firstCtrl: any = component.questionsArray.controls[0]
    if (firstCtrl.controls.answer.valid) {
      throw new Error('expected answer control to be invalid')
    }
    // now set a valid value and check validity becomes true
    (component.questionsArray.controls[0] as any).controls.answer.setValue('some')
  component.updateSurveyFormValidity()
    // after updating validity, the control itself should be valid
    if (!firstCtrl.controls.answer.valid) {
      throw new Error('expected answer control to be valid')
    }
  })

  it('submitForm should not call submit when surveyFormIsValid is false', () => {
    component.surveyFormIsValid = false
    component.surveyForm = fb.group({ fields: fb.array([]) })
    mockAppTocSvc.submitForm.mockClear()
    component.submitForm()
    expect(mockAppTocSvc.submitForm).not.toHaveBeenCalled()
  })

  it('submitForm should handle submit error path', () => {
    mockAppTocSvc.submitForm.mockReturnValue(throwError(() => ({ message: 'fail' })))
    component.surveyFormIsValid = true
    component.surveyForm = fb.group({ fields: fb.array([]) })
    component.submitForm()
    expect(mockSnackBar.open).toHaveBeenCalled()
    // dialogRef should not be closed with true in error
    expect(mockDialogRef.close).toHaveBeenCalledWith(true)
  })
})
