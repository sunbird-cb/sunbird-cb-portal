import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { StandaloneAssessmentComponent } from './standalone-assessment.component'

describe('StandaloneAssessmentComponent', () => {
  let component: StandaloneAssessmentComponent
  let fixture: ComponentFixture<StandaloneAssessmentComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StandaloneAssessmentComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(StandaloneAssessmentComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
