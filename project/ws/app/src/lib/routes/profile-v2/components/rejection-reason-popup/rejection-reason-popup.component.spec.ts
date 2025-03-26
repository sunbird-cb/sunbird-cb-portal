import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { RejectionReasonPopupComponent } from './rejection-reason-popup.component'

describe('RejectionReasonPopupComponent', () => {
  let component: RejectionReasonPopupComponent
  let fixture: ComponentFixture<RejectionReasonPopupComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RejectionReasonPopupComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectionReasonPopupComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
