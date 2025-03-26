import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { EventYouTubeComponent } from './event-you-tube.component'

describe('EventYouTubeComponent', () => {
  let component: EventYouTubeComponent
  let fixture: ComponentFixture<EventYouTubeComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EventYouTubeComponent],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(EventYouTubeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
