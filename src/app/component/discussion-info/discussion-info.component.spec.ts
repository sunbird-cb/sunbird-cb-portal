import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { DiscussionInfoComponent } from './discussion-info.component'

describe('DiscussionInfoComponent', () => {
  let component: DiscussionInfoComponent
  let fixture: ComponentFixture<DiscussionInfoComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DiscussionInfoComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscussionInfoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
