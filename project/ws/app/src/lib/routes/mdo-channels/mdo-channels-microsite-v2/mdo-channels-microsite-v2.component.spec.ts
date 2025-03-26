import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { MdoChannelsMicrositeV2Component } from './mdo-channels-microsite-v2.component'

describe('MdoChannelsMicrositeV2Component', () => {
  let component: MdoChannelsMicrositeV2Component
  let fixture: ComponentFixture<MdoChannelsMicrositeV2Component>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MdoChannelsMicrositeV2Component],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(MdoChannelsMicrositeV2Component)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
