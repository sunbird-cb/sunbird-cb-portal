import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { SlidersDynamicComponent } from './sliders-dynamic.component'

describe('SlidersComponent', () => {
  let component: SlidersDynamicComponent
  let fixture: ComponentFixture<SlidersDynamicComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SlidersDynamicComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SlidersDynamicComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
