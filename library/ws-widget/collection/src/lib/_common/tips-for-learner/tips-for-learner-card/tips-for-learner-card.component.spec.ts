import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { TipsForLearnerCardComponent } from './tips-for-learner-card.component'

describe('TipsForLearnerCardComponent', () => {
  let component: TipsForLearnerCardComponent
  let fixture: ComponentFixture<TipsForLearnerCardComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TipsForLearnerCardComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(TipsForLearnerCardComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
