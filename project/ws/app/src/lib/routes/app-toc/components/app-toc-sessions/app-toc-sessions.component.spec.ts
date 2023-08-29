import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { AppTocSessionsComponent } from './app-toc-sessions.component'

describe('AppTocSessionsComponent', () => {
  let component: AppTocSessionsComponent
  let fixture: ComponentFixture<AppTocSessionsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppTocSessionsComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTocSessionsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
