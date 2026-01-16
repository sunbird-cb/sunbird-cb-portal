import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { CardCompetencyComponent } from './card-competency.component'

describe('CardCompetencyComponent', () => {
  let component: CardCompetencyComponent
  let fixture: ComponentFixture<CardCompetencyComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardCompetencyComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CardCompetencyComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
