import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { NetworkHubComponent } from './network-hub.component'

describe('NetworkHubComponent', () => {
  let component: NetworkHubComponent
  let fixture: ComponentFixture<NetworkHubComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NetworkHubComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkHubComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
