import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowledgeCardComponent } from './knowledge-card.component';

describe('KnowledgeCardComponent', () => {
  let component: KnowledgeCardComponent;
  let fixture: ComponentFixture<KnowledgeCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KnowledgeCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KnowledgeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
