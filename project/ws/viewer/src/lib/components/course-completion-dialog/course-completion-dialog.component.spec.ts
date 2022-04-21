import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { CourseCompletionDialogComponent } from './course-completion-dialog.component'

describe('CourseCompletionDialogComponent', () => {
  let component: CourseCompletionDialogComponent
  let fixture: ComponentFixture<CourseCompletionDialogComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CourseCompletionDialogComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseCompletionDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
