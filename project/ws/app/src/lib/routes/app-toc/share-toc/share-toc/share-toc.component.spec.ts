import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareTocComponent } from './share-toc.component';

describe('ShareTocComponent', () => {
  let component: ShareTocComponent;
  let fixture: ComponentFixture<ShareTocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareTocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareTocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
