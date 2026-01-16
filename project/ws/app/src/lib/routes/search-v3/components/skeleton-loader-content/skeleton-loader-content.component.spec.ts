import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonLoaderContentComponent } from './skeleton-loader-content.component';

describe('SkeletonLoaderContentComponent', () => {
  let component: SkeletonLoaderContentComponent;
  let fixture: ComponentFixture<SkeletonLoaderContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SkeletonLoaderContentComponent]
    });
    fixture = TestBed.createComponent(SkeletonLoaderContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
