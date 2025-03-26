import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ContentTocComponent } from './content-toc.component'

describe('ContentTocComponent', () => {
  let component: ContentTocComponent
  let fixture: ComponentFixture<ContentTocComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContentTocComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentTocComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
