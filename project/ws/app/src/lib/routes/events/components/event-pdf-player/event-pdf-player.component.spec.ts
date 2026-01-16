import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { EventPdfPlayerComponent } from './event-pdf-player.component'

describe('EventPdfPlayerComponent', () => {
  let component: EventPdfPlayerComponent
  let fixture: ComponentFixture<EventPdfPlayerComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EventPdfPlayerComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(EventPdfPlayerComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
