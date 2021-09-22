import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ContentRatingV2DialogComponent } from './content-rating-v2-dialog.component'

describe('ContentRatingV2DialogComponent', () => {
  let component: ContentRatingV2DialogComponent
  let fixture: ComponentFixture<ContentRatingV2DialogComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContentRatingV2DialogComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentRatingV2DialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
