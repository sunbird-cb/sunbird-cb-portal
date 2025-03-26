import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { GyaanKarmayogiComponent } from './gyaan-karmayogi.component'

describe('GyaanKarmayogiComponent', () => {
  let component: GyaanKarmayogiComponent
  let fixture: ComponentFixture<GyaanKarmayogiComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GyaanKarmayogiComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(GyaanKarmayogiComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
