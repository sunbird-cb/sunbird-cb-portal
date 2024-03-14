import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyPocComponent } from './survey-poc.component';

describe('SurveyPocComponent', () => {
  let component: SurveyPocComponent;
  let fixture: ComponentFixture<SurveyPocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyPocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyPocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
