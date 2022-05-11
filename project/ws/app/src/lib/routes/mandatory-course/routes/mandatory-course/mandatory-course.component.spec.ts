import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { MandatoryCourseComponent } from './mandatory-course.component'

describe('MandatoryCourseComponent', () => {
  let component: MandatoryCourseComponent
  let fixture: ComponentFixture<MandatoryCourseComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MandatoryCourseComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(MandatoryCourseComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
