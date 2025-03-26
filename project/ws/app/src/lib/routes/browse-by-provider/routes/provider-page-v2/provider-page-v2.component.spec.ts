import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ProviderPageV2Component } from './provider-page-v2.component'

describe('ProviderPageV2Component', () => {
  let component: ProviderPageV2Component
  let fixture: ComponentFixture<ProviderPageV2Component>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProviderPageV2Component],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderPageV2Component)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
