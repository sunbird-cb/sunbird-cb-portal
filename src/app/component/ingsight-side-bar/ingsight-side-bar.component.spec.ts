import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngsightSideBarComponent } from './ingsight-side-bar.component';

describe('IngsightSideBarComponent', () => {
  let component: IngsightSideBarComponent;
  let fixture: ComponentFixture<IngsightSideBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngsightSideBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngsightSideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
