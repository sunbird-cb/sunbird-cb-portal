import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowledgeSavedComponent } from './knowledge-saved.component';

describe('KnowledgeSavedComponent', () => {
  let component: KnowledgeSavedComponent;
  let fixture: ComponentFixture<KnowledgeSavedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KnowledgeSavedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KnowledgeSavedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
