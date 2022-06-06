import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { CurrentCompetenciesComponent } from './current-competencies.component'

describe('CurrentCompetenciesComponent', () => {
  let component: CurrentCompetenciesComponent
  let fixture: ComponentFixture<CurrentCompetenciesComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CurrentCompetenciesComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentCompetenciesComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
