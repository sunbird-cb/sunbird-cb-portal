import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { CurrentCompetencyCardComponent } from './current-competency-card.component'

describe('CompetencyCardComponent', () => {
  let component: CurrentCompetencyCardComponent
  let fixture: ComponentFixture<CurrentCompetencyCardComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CurrentCompetencyCardComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentCompetencyCardComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
