import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportAIComponent } from './support-ai.component';

describe('AiTutorComponent', () => {
  let component: SupportAIComponent;
  let fixture: ComponentFixture<SupportAIComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SupportAIComponent]
    });
    fixture = TestBed.createComponent(SupportAIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
