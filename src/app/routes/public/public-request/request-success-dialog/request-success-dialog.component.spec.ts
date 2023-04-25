import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestSuccessDialogComponent } from './request-success-dialog.component';

describe('RequestSuccessDialogComponent', () => {
  let component: RequestSuccessDialogComponent;
  let fixture: ComponentFixture<RequestSuccessDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestSuccessDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestSuccessDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
