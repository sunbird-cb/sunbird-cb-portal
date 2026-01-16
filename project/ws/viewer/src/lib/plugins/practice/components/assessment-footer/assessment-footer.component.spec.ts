import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { AssessmentFooterComponent } from './assessment-footer.component'

describe('AssessmentFooterComponent', () => {
  let component: AssessmentFooterComponent
  let fixture: ComponentFixture<AssessmentFooterComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AssessmentFooterComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentFooterComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
