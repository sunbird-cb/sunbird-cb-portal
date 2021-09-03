import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ProviderOverviewComponent } from './provider-overview.component'

describe('ProviderOverviewComponent', () => {
  let component: ProviderOverviewComponent
  let fixture: ComponentFixture<ProviderOverviewComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProviderOverviewComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderOverviewComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
