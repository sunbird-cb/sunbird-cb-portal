import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ProviderCalendarComponent } from './provider-calendar.component'

describe('ProviderCalendarComponent', () => {
  let component: ProviderCalendarComponent
  let fixture: ComponentFixture<ProviderCalendarComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProviderCalendarComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderCalendarComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
