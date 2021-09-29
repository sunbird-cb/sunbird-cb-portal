import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportproblemComponent } from './reportproblem.component';

describe('ReportproblemComponent', () => {
  let component: ReportproblemComponent;
  let fixture: ComponentFixture<ReportproblemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportproblemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportproblemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
