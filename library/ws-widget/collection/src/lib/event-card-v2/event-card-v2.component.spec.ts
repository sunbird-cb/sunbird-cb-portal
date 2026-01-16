import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { EventCardV2Component } from './event-card-v2.component'

describe('CardContentV2Component', () => {
  let component: EventCardV2Component
  let fixture: ComponentFixture<EventCardV2Component>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EventCardV2Component],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(EventCardV2Component)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
