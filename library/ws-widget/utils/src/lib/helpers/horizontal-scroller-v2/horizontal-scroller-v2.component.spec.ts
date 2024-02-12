import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { HorizontalScrollerV2Component } from './horizontal-scroller-v2.component'

describe('HorizontalScrollerV2Component', () => {
  let component: HorizontalScrollerV2Component
  let fixture: ComponentFixture<HorizontalScrollerV2Component>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HorizontalScrollerV2Component],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(HorizontalScrollerV2Component)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
