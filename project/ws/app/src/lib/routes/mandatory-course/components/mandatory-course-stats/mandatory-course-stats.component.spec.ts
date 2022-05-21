import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { MandatoryCourseStatsComponent } from './mandatory-course-stats.component'

describe('MandatoryCourseStatsComponent', () => {
  let component: MandatoryCourseStatsComponent
  let fixture: ComponentFixture<MandatoryCourseStatsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MandatoryCourseStatsComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(MandatoryCourseStatsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
