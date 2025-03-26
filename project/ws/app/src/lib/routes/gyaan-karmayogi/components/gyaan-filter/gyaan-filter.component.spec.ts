import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { GyaanFilterComponent } from './gyaan-filter.component'

describe('GyaanFilterComponent', () => {
  let component: GyaanFilterComponent
  let fixture: ComponentFixture<GyaanFilterComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GyaanFilterComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(GyaanFilterComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
