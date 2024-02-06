import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CbpPlanFeedComponent } from './cbp-plan-feed.component';

describe('CbpPlanFeedComponent', () => {
  let component: CbpPlanFeedComponent;
  let fixture: ComponentFixture<CbpPlanFeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CbpPlanFeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CbpPlanFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
