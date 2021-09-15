import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { CompetencyAllWrapperComponent } from './competency-all-wrapper.component'

describe('CompetencyAllWrapperComponent', () => {
  let component: CompetencyAllWrapperComponent
  let fixture: ComponentFixture<CompetencyAllWrapperComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompetencyAllWrapperComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetencyAllWrapperComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
