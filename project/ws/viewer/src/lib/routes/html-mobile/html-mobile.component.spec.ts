import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { HtmlMobileComponent } from './html-mobile.component'

describe('HtmlMobileComponent', () => {
  let component: HtmlMobileComponent
  let fixture: ComponentFixture<HtmlMobileComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HtmlMobileComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(HtmlMobileComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
