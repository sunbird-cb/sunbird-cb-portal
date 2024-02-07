import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { AttendanceHelperComponent } from './attendance-helper.component'

describe('AttendanceHelperComponent', () => {
  let component: AttendanceHelperComponent
  let fixture: ComponentFixture<AttendanceHelperComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AttendanceHelperComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceHelperComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
