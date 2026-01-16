import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiTutorConfirmPopupComponent } from './ai-tutor-confirm-popup.component';

describe('AiTutorConfirmPopupComponent', () => {
  let component: AiTutorConfirmPopupComponent;
  let fixture: ComponentFixture<AiTutorConfirmPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AiTutorConfirmPopupComponent]
    });
    fixture = TestBed.createComponent(AiTutorConfirmPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
