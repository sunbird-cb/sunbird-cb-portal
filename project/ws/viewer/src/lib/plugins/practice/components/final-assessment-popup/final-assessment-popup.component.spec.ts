import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { FinalAssessmentPopupComponent } from './final-assessment-popup.component'

describe('FinalAssessmentPopupComponent', () => {
  let component: FinalAssessmentPopupComponent
  let fixture: ComponentFixture<FinalAssessmentPopupComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FinalAssessmentPopupComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalAssessmentPopupComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
