import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonReleventFeedbackDialogComponent } from './non-relevent-feedback-dialog.component';

describe('NonReleventFeedbackDialogComponent', () => {
  let component: NonReleventFeedbackDialogComponent;
  let fixture: ComponentFixture<NonReleventFeedbackDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NonReleventFeedbackDialogComponent]
    });
    fixture = TestBed.createComponent(NonReleventFeedbackDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
