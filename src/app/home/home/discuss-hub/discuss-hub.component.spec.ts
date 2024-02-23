import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { DiscussHubComponent } from './discuss-hub.component'

describe('DiscussHubComponent', () => {
  let component: DiscussHubComponent
  let fixture: ComponentFixture<DiscussHubComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DiscussHubComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscussHubComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
