import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { ClientSliderComponent } from './client-slider.component'

describe('ClientSliderComponent', () => {
  let component: ClientSliderComponent
  let fixture: ComponentFixture<ClientSliderComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClientSliderComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientSliderComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
