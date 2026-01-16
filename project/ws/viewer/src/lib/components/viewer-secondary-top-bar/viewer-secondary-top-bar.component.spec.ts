import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ViewerSecondaryTopBarComponent } from './viewer-secondary-top-bar.component'

describe('ViewerSecondaryTopBarComponent', () => {
  let component: ViewerSecondaryTopBarComponent
  let fixture: ComponentFixture<ViewerSecondaryTopBarComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewerSecondaryTopBarComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewerSecondaryTopBarComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
