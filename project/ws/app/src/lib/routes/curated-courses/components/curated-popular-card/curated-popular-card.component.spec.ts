import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuratedPopularCardComponent } from './curated-popular-card.component';

describe('CuratedPopularCardComponent', () => {
  let component: CuratedPopularCardComponent;
  let fixture: ComponentFixture<CuratedPopularCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuratedPopularCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuratedPopularCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
