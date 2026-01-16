import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { AppTocHomeV2Component } from './app-toc-home-v2.component'

describe('AppTocHomeV2Component', () => {
  let component: AppTocHomeV2Component
  let fixture: ComponentFixture<AppTocHomeV2Component>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppTocHomeV2Component],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTocHomeV2Component)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
