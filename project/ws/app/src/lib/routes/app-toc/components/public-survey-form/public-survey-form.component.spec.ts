import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicSurveyFormComponent } from './public-survey-form.component';

describe('PublicSurveyFormComponent', () => {
  let component: PublicSurveyFormComponent;
  let fixture: ComponentFixture<PublicSurveyFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PublicSurveyFormComponent]
    });
    fixture = TestBed.createComponent(PublicSurveyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
