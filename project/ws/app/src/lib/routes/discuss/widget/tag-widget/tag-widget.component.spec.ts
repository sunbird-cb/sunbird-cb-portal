import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { TagWidgetComponent } from './tag-widget.component'

describe('TagWidgetComponent', () => {
  let component: TagWidgetComponent
  let fixture: ComponentFixture<TagWidgetComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TagWidgetComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(TagWidgetComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
