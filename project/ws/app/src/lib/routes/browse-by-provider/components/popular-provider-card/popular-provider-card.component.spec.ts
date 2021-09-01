import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { PopularProviderCardComponent } from './popular-provider-card.component'

describe('PopularProviderCardComponent', () => {
  let component: PopularProviderCardComponent
  let fixture: ComponentFixture<PopularProviderCardComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PopularProviderCardComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PopularProviderCardComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
