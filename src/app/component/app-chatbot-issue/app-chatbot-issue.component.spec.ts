import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppChatbotIssueComponent } from './app-chatbot-issue.component';

describe('AppChatbotIssueComponent', () => {
  let component: AppChatbotIssueComponent;
  let fixture: ComponentFixture<AppChatbotIssueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppChatbotIssueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppChatbotIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
