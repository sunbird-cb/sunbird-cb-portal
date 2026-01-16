import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppOtpReaderComponent } from './app-otp-reader.component';

describe('AppOtpReaderComponent', () => {
  let component: AppOtpReaderComponent;
  let fixture: ComponentFixture<AppOtpReaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppOtpReaderComponent]
    });
    fixture = TestBed.createComponent(AppOtpReaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
