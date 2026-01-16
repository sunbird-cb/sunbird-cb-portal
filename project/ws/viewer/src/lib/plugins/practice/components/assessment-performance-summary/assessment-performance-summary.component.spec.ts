import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { AssessmentPerformanceSummaryComponent } from './assessment-performance-summary.component'

describe('AssessmentPerformanceSummaryComponent', () => {
  let component: AssessmentPerformanceSummaryComponent
  let fixture: ComponentFixture<AssessmentPerformanceSummaryComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AssessmentPerformanceSummaryComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentPerformanceSummaryComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
