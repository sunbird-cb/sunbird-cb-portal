import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { PlatformWalkthroughComponent } from './platform-walkthrough.component'

describe('PlatformWalkthroughComponent', () => {
  let component: PlatformWalkthroughComponent
  let fixture: ComponentFixture<PlatformWalkthroughComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlatformWalkthroughComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PlatformWalkthroughComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
