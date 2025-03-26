import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { VerifyOtpComponent } from './verify-otp.component'

describe('VerifyOtpComponent', () => {
  let component: VerifyOtpComponent
  let fixture: ComponentFixture<VerifyOtpComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VerifyOtpComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyOtpComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
