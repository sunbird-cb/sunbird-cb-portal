import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { AppTocContentCardV2Component } from './app-toc-content-card-v2.component'

describe('AppTocContentCardV2Component', () => {
  let component: AppTocContentCardV2Component
  let fixture: ComponentFixture<AppTocContentCardV2Component>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppTocContentCardV2Component],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTocContentCardV2Component)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
