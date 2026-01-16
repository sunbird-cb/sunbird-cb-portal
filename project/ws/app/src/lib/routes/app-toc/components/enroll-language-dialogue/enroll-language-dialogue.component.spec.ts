import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollLanguageDialogueComponent } from './enroll-language-dialogue.component';

describe('EnrollLanguageDialogueComponent', () => {
  let component: EnrollLanguageDialogueComponent;
  let fixture: ComponentFixture<EnrollLanguageDialogueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnrollLanguageDialogueComponent]
    });
    fixture = TestBed.createComponent(EnrollLanguageDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
