import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyFormQuestionComponent } from './survey-form-question.component';

describe('SurveyFormQuestionComponent', () => {
  let component: SurveyFormQuestionComponent;
  let fixture: ComponentFixture<SurveyFormQuestionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SurveyFormQuestionComponent]
    });
    fixture = TestBed.createComponent(SurveyFormQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
