import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IGotSarthiComponent } from './igot-sarthi.component';

describe('AiTutorComponent', () => {
  let component: IGotSarthiComponent;
  let fixture: ComponentFixture<IGotSarthiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IGotSarthiComponent]
    });
    fixture = TestBed.createComponent(IGotSarthiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
