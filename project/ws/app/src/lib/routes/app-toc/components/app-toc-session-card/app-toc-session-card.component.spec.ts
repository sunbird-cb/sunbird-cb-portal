import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { AppTocSessionCardComponent } from './app-toc-session-card.component'

describe('AppTocSessionCardComponent', () => {
  let component: AppTocSessionCardComponent
  let fixture: ComponentFixture<AppTocSessionCardComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppTocSessionCardComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTocSessionCardComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
