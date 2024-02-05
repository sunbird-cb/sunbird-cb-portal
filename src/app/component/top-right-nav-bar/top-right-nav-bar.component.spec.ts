import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { TopRightNavBarComponent } from './top-right-nav-bar.component'

describe('TopRightNavBarComponent', () => {
  let component: TopRightNavBarComponent
  let fixture: ComponentFixture<TopRightNavBarComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TopRightNavBarComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(TopRightNavBarComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  });

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
