import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { AssessmentPerformanceInsightSummaryComponent } from './assessment-performance-insight-summary.component'

describe('AssessmentPerformanceInsightSummaryComponent', () => {
  let component: AssessmentPerformanceInsightSummaryComponent
  let fixture: ComponentFixture<AssessmentPerformanceInsightSummaryComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AssessmentPerformanceInsightSummaryComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentPerformanceInsightSummaryComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
