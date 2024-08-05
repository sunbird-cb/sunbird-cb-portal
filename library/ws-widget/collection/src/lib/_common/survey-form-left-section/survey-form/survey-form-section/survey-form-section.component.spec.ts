import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyFormSectionComponent } from './survey-form-section.component';

describe('SurveyFormSectionComponent', () => {
  let component: SurveyFormSectionComponent;
  let fixture: ComponentFixture<SurveyFormSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyFormSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyFormSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
