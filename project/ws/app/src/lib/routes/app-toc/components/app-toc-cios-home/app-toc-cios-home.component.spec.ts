import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { AppTocCiosHomeComponent } from './app-toc-cios-home.component'

describe('AppTocCiosHomeComponent', () => {
  let component: AppTocCiosHomeComponent
  let fixture: ComponentFixture<AppTocCiosHomeComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppTocCiosHomeComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTocCiosHomeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
