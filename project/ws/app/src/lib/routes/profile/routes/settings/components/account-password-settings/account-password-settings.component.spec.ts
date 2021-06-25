import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { AccountPasswordSettingsComponent } from './account-password-settings.component'

describe('NotificationSettingsComponent', () => {
  let component: AccountPasswordSettingsComponent
  let fixture: ComponentFixture<AccountPasswordSettingsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccountPasswordSettingsComponent],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountPasswordSettingsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
