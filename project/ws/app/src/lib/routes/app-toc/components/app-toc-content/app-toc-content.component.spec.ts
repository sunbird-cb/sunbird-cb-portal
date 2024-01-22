import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppTocContentComponent } from './app-toc-content.component';

describe('AppTocContentComponent', () => {
  let component: AppTocContentComponent;
  let fixture: ComponentFixture<AppTocContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppTocContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTocContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
