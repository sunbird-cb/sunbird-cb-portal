import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ModeratedCoursesComponent } from './moderated-courses.component'

describe('ModeratedCoursesComponent', () => {
  let component: ModeratedCoursesComponent
  let fixture: ComponentFixture<ModeratedCoursesComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModeratedCoursesComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ModeratedCoursesComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
