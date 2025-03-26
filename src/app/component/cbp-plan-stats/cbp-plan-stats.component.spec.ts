import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { CbpPlanStatsComponent } from './cbp-plan-stats.component'

describe('CbpPlanStatsComponent', () => {
  let component: CbpPlanStatsComponent
  let fixture: ComponentFixture<CbpPlanStatsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CbpPlanStatsComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CbpPlanStatsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
