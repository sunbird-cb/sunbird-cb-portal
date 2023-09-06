import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppChatbotInfoComponent } from './app-chatbot-info.component';

describe('AppChatbotInfoComponent', () => {
  let component: AppChatbotInfoComponent;
  let fixture: ComponentFixture<AppChatbotInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppChatbotInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppChatbotInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
