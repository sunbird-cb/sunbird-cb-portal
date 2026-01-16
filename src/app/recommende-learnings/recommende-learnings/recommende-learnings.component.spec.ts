import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { CbpPlanComponent } from './recommende-learnings.component'

describe('CbpPlanComponent', () => {
  let component: CbpPlanComponent
  let fixture: ComponentFixture<CbpPlanComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CbpPlanComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CbpPlanComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
