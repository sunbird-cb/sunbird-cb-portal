import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { MdoChannelsAllContentComponent } from './mdo-channels-all-content.component'

describe('MdoChannelsAllContentComponent', () => {
  let component: MdoChannelsAllContentComponent
  let fixture: ComponentFixture<MdoChannelsAllContentComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MdoChannelsAllContentComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(MdoChannelsAllContentComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
