import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { PopularCompetencyCardComponent } from './popular-competency-card.component'

describe('PopularCompetencyCardComponent', () => {
  let component: PopularCompetencyCardComponent
  let fixture: ComponentFixture<PopularCompetencyCardComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PopularCompetencyCardComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PopularCompetencyCardComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
