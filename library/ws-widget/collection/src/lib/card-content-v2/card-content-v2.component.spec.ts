import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { CardContentV2Component } from './card-content-v2.component'

describe('CardContentV2Component', () => {
  let component: CardContentV2Component
  let fixture: ComponentFixture<CardContentV2Component>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardContentV2Component],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CardContentV2Component)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
