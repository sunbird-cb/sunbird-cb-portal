import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingTimelineComponent } from './upcoming-timeline.component';

describe('UpcomingTimelineComponent', () => {
  let component: UpcomingTimelineComponent;
  let fixture: ComponentFixture<UpcomingTimelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpcomingTimelineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpcomingTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
