import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ProviderAllCbpComponent } from './provider-all-cbp.component'

describe('ProviderAllCbpComponent', () => {
  let component: ProviderAllCbpComponent
  let fixture: ComponentFixture<ProviderAllCbpComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProviderAllCbpComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderAllCbpComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
