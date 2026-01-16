import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { EventPlayerComponent } from './event-player.component'

describe('EventPlayerComponent', () => {
  let component: EventPlayerComponent
  let fixture: ComponentFixture<EventPlayerComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EventPlayerComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(EventPlayerComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
