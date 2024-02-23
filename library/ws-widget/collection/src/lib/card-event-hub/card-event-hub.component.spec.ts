import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { CardEventHubComponent } from './card-event-hub.component'

describe('CardEventHubComponent', () => {
  let component: CardEventHubComponent
  let fixture: ComponentFixture<CardEventHubComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardEventHubComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CardEventHubComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
