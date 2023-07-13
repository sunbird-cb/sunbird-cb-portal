import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { OfflineResourceComponent } from './offline-resource.component'

describe('OfflineResourceComponent', () => {
  let component: OfflineResourceComponent;
  let fixture: ComponentFixture<OfflineResourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflineResourceComponent ]
    })
    .compileComponents();
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  })
})
