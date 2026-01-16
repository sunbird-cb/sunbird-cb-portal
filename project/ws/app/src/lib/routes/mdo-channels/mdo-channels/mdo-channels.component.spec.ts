import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { MdoChannelsComponent } from './mdo-channels.component'

describe('MdoChannelsComponent', () => {
  let component: MdoChannelsComponent
  let fixture: ComponentFixture<MdoChannelsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MdoChannelsComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(MdoChannelsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
