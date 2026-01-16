import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonLoaderPeoplesComponent } from './skeleton-loader-peoples.component';

describe('SkeletonLoaderPeoplesComponent', () => {
  let component: SkeletonLoaderPeoplesComponent;
  let fixture: ComponentFixture<SkeletonLoaderPeoplesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SkeletonLoaderPeoplesComponent]
    });
    fixture = TestBed.createComponent(SkeletonLoaderPeoplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
