import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ProviderContentAllComponent } from './provider-content-all.component'

describe('ProviderContentAllComponent', () => {
  let component: ProviderContentAllComponent
  let fixture: ComponentFixture<ProviderContentAllComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProviderContentAllComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderContentAllComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
