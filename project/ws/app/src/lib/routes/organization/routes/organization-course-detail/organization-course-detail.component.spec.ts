import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { OrganizationCourseDetailComponent } from './organization-course-detail.component'

describe('OrganizationCourseDetailComponent', () => {
  let component: OrganizationCourseDetailComponent
  let fixture: ComponentFixture<OrganizationCourseDetailComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrganizationCourseDetailComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationCourseDetailComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
