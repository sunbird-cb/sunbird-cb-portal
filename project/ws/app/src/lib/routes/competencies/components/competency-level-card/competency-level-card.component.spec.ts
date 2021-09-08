import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetencyLevelCardComponent } from './competency-level-card.component';

describe('CompetencyLevelCardComponent', () => {
  let component: CompetencyLevelCardComponent;
  let fixture: ComponentFixture<CompetencyLevelCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompetencyLevelCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetencyLevelCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
