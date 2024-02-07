import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { HomeOtherPortalComponent } from './home-other-portal.component'

describe('HomeOtherPortalComponent', () => {
  let component: HomeOtherPortalComponent
  let fixture: ComponentFixture<HomeOtherPortalComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomeOtherPortalComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeOtherPortalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
