import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { GyaanVideoComponent } from './gyaan-video.component'

describe('GyaanVideoComponent', () => {
  let component: GyaanVideoComponent
  let fixture: ComponentFixture<GyaanVideoComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GyaanVideoComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(GyaanVideoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
