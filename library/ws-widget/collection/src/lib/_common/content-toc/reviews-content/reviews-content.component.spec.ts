import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ReviewsContentComponent } from './reviews-content.component'

describe('ReviewsContentComponent', () => {
  let component: ReviewsContentComponent
  let fixture: ComponentFixture<ReviewsContentComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewsContentComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewsContentComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
