import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { GyaanKarmayogiViewAllComponent } from './gyaan-karmayogi-view-all.component'

describe('GyaanKarmayogiViewAllComponent', () => {
  let component: GyaanKarmayogiViewAllComponent
  let fixture: ComponentFixture<GyaanKarmayogiViewAllComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GyaanKarmayogiViewAllComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(GyaanKarmayogiViewAllComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
