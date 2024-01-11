import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCompetencyPassbookComponent } from './my-competency-passbook.component';

describe('MyCompetencyPassbookComponent', () => {
  let component: MyCompetencyPassbookComponent;
  let fixture: ComponentFixture<MyCompetencyPassbookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyCompetencyPassbookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyCompetencyPassbookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
