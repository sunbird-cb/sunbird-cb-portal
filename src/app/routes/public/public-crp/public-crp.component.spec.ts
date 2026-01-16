import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicCrpComponent } from './public-crp.component';

describe('PublicCrpComponent', () => {
  let component: PublicCrpComponent;
  let fixture: ComponentFixture<PublicCrpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PublicCrpComponent]
    });
    fixture = TestBed.createComponent(PublicCrpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
