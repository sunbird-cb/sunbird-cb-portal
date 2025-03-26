import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { AppTocAboutComponent } from './app-toc-about.component'

describe('AppTocAboutComponent', () => {
  let component: AppTocAboutComponent
  let fixture: ComponentFixture<AppTocAboutComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppTocAboutComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTocAboutComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
