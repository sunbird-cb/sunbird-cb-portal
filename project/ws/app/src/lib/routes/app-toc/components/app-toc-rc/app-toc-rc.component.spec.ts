import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { AppTocRcComponent } from './app-toc-rc.component'

describe('AppTocRcComponent', () => {
  let component: AppTocRcComponent
  let fixture: ComponentFixture<AppTocRcComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppTocRcComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTocRcComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
