import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SamuhikCharchaContentComponent } from './samuhik-charcha-content.component';

describe('SamuhikCharchaContentComponent', () => {
  let component: SamuhikCharchaContentComponent;
  let fixture: ComponentFixture<SamuhikCharchaContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SamuhikCharchaContentComponent]
    });
    fixture = TestBed.createComponent(SamuhikCharchaContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
