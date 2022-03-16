import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { CardRatingCommentComponent } from './card-rating-comment.component'

describe('CardRatingCommentComponent', () => {
  let component: CardRatingCommentComponent
  let fixture: ComponentFixture<CardRatingCommentComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardRatingCommentComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CardRatingCommentComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
