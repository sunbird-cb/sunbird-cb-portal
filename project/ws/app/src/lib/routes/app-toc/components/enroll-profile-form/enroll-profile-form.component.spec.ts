import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { EnrollProfileFormComponent } from './enroll-profile-form.component'

describe('EnrollProfileFormComponent', () => {
  let component: EnrollProfileFormComponent
  let fixture: ComponentFixture<EnrollProfileFormComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EnrollProfileFormComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollProfileFormComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
