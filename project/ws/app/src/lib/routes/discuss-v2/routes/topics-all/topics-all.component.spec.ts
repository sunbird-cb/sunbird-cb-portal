import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicsAllComponent } from './topics-all.component';

describe('TopicsAllComponent', () => {
  let component: TopicsAllComponent;
  let fixture: ComponentFixture<TopicsAllComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TopicsAllComponent]
    });
    fixture = TestBed.createComponent(TopicsAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
