import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowledgeHomeComponent } from './knowledge-home.component';

describe('KnowledgeHomeComponent', () => {
  let component: KnowledgeHomeComponent;
  let fixture: ComponentFixture<KnowledgeHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KnowledgeHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KnowledgeHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
