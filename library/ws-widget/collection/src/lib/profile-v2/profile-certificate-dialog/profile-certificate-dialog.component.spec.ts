import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ProfileCertificateDialogComponent } from './profile-certificate-dialog.component'

describe('ProfileCertificateDialogComponent', () => {
  let component: ProfileCertificateDialogComponent
  let fixture: ComponentFixture<ProfileCertificateDialogComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileCertificateDialogComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileCertificateDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
