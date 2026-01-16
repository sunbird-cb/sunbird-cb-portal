import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { EnrollQuestionnaireComponent } from './enroll-questionnaire.component'

describe('EnrollQuestionnaireComponent', () => {
  let component: EnrollQuestionnaireComponent
  let fixture: ComponentFixture<EnrollQuestionnaireComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EnrollQuestionnaireComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollQuestionnaireComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
