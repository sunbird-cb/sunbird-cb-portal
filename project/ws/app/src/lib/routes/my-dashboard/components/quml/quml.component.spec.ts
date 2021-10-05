import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QumlComponent } from './quml.component';

describe('QumlComponent', () => {
  let component: QumlComponent;
  let fixture: ComponentFixture<QumlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QumlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QumlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
