import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { OverduePlanComponent } from './overdue-plan.component'

describe('OverduePlanComponent', () => {
  let component: OverduePlanComponent
  let fixture: ComponentFixture<OverduePlanComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OverduePlanComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(OverduePlanComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
