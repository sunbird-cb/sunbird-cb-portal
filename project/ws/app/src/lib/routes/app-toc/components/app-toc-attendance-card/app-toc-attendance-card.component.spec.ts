import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppTocAttendanceCardComponent } from './app-toc-attendance-card.component';

describe('AppTocAttendanceCardComponent', () => {
  let component: AppTocAttendanceCardComponent;
  let fixture: ComponentFixture<AppTocAttendanceCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppTocAttendanceCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTocAttendanceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
