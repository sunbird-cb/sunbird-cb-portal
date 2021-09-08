import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetencyDetailedViewComponent } from './competency-detailed-view.component';

describe('CompetencyDetailedViewComponent', () => {
  let component: CompetencyDetailedViewComponent;
  let fixture: ComponentFixture<CompetencyDetailedViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompetencyDetailedViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetencyDetailedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
