import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { MdoChannelsMicrositeComponent } from './mdo-channels-microsite.component'

describe('MdoChannelsMicrositeComponent', () => {
  let component: MdoChannelsMicrositeComponent
  let fixture: ComponentFixture<MdoChannelsMicrositeComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MdoChannelsMicrositeComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(MdoChannelsMicrositeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
