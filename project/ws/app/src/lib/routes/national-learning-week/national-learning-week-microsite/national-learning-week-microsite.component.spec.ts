import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { NationalLearningWeekMicrositeComponent } from './national-learning-week-microsite.component'

describe('NationalLearningWeekMicrositeComponent', () => {
  let component: NationalLearningWeekMicrositeComponent
  let fixture: ComponentFixture<NationalLearningWeekMicrositeComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NationalLearningWeekMicrositeComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(NationalLearningWeekMicrositeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
