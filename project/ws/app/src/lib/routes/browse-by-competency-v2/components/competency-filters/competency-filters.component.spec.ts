import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { CompetencyFiltersComponent } from './competency-filters.component'

describe('CompetencyFiltersComponent', () => {
  let component: CompetencyFiltersComponent
  let fixture: ComponentFixture<CompetencyFiltersComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompetencyFiltersComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetencyFiltersComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
