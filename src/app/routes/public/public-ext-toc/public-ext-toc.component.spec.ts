import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicExtTocComponent } from './public-ext-toc.component';

describe('PublicExtTocComponent', () => {
  let component: PublicExtTocComponent;
  let fixture: ComponentFixture<PublicExtTocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicExtTocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicExtTocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
