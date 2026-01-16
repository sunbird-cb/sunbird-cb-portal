import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { SurveyShikshaComponent } from './survey-shiksha.component'

describe('SurveyShikshaComponent', () => {
  let component: SurveyShikshaComponent
  let fixture: ComponentFixture<SurveyShikshaComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SurveyShikshaComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyShikshaComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
