import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { AllProvidersComponent } from './all-providers.component'

describe('AllProvidersComponent', () => {
  let component: AllProvidersComponent
  let fixture: ComponentFixture<AllProvidersComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AllProvidersComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AllProvidersComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
