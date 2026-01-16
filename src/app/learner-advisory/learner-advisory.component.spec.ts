import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { LearnerAdvisoryComponent } from './learner-advisory.component'

describe('LearnerAdvisoryComponent', () => {
  let component: LearnerAdvisoryComponent
  let fixture: ComponentFixture<LearnerAdvisoryComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LearnerAdvisoryComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnerAdvisoryComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
