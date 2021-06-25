import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { PrivacySettingsComponent } from './privacy-settings.component'

describe('NotificationSettingsComponent', () => {
  let component: PrivacySettingsComponent
  let fixture: ComponentFixture<PrivacySettingsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PrivacySettingsComponent],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacySettingsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
