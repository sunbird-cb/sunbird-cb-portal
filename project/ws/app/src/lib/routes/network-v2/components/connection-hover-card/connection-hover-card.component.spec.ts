import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ConnectionHoverCardComponent } from './connection-hover-card.component'

describe('ConnectionHoverCardComponent', () => {
  let component: ConnectionHoverCardComponent
  let fixture: ComponentFixture<ConnectionHoverCardComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConnectionHoverCardComponent],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionHoverCardComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
