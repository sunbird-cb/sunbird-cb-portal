import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { EhrmsComponent } from './ehrms.component'

describe('EhrmsComponent', () => {
  let component: EhrmsComponent
  let fixture: ComponentFixture<EhrmsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EhrmsComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(EhrmsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
