import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { ContentStripWithTabsComponent } from './content-strip-with-tabs.component'

describe('ContentStripWithTabsComponent', () => {
  let component: ContentStripWithTabsComponent
  let fixture: ComponentFixture<ContentStripWithTabsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContentStripWithTabsComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentStripWithTabsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
