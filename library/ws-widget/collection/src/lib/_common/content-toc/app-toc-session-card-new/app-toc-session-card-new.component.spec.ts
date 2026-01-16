import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { AppTocSessionCardNewComponent } from './app-toc-session-card-new.component'

describe('AppTocSessionCardComponent', () => {
  let component: AppTocSessionCardNewComponent
  let fixture: ComponentFixture<AppTocSessionCardNewComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppTocSessionCardNewComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTocSessionCardNewComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
