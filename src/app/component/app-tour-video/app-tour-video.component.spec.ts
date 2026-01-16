import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { AppTourVideoComponent } from './app-tour-video.component'

describe('AppTourVideoComponent', () => {
  let component: AppTourVideoComponent
  let fixture: ComponentFixture<AppTourVideoComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppTourVideoComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTourVideoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
