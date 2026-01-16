import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IiidemComponent } from './iiidem.component';

describe('IiidemComponent', () => {
  let component: IiidemComponent;
  let fixture: ComponentFixture<IiidemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IiidemComponent]
    });
    fixture = TestBed.createComponent(IiidemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
