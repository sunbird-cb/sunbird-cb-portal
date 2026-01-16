import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityDetailsHomeComponent } from './community-details-home.component';

describe('CommunityDetailsHomeComponent', () => {
  let component: CommunityDetailsHomeComponent;
  let fixture: ComponentFixture<CommunityDetailsHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommunityDetailsHomeComponent]
    });
    fixture = TestBed.createComponent(CommunityDetailsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
