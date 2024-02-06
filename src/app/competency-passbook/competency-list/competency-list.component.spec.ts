import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetencyListComponent } from './competency-list.component';

describe('CompetencyListComponent', () => {
  let component: CompetencyListComponent;
  let fixture: ComponentFixture<CompetencyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompetencyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetencyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
