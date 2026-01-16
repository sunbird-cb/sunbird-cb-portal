import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { CompetencyDetailsComponent } from './competency-details.component'

describe('CompetencyDetailsComponent', () => {
  let component: CompetencyDetailsComponent
  let fixture: ComponentFixture<CompetencyDetailsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompetencyDetailsComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetencyDetailsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
