import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { GyaanKarmayogiHomeComponent } from './gyaan-karmayogi-home.component'

describe('GyaanKarmayogiHomeComponent', () => {
  let component: GyaanKarmayogiHomeComponent
  let fixture: ComponentFixture<GyaanKarmayogiHomeComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GyaanKarmayogiHomeComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(GyaanKarmayogiHomeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
