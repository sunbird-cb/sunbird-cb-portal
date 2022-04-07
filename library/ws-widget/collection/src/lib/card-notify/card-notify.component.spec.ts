import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { CardNotifyComponent } from './card-notify.component'

describe('CardNotifyComponent', () => {
  let component: CardNotifyComponent
  let fixture: ComponentFixture<CardNotifyComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardNotifyComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CardNotifyComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
