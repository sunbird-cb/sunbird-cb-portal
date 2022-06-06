import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { SignupSuccessDialogueComponent } from './signup-success-dialogue.component'

describe('SignupSuccessDialogueComponent', () => {
  let component: SignupSuccessDialogueComponent
  let fixture: ComponentFixture<SignupSuccessDialogueComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SignupSuccessDialogueComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupSuccessDialogueComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
