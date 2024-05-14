import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderPageComponent } from './provider-page.component';

describe('ProviderPageComponent', () => {
  let component: ProviderPageComponent;
  let fixture: ComponentFixture<ProviderPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
