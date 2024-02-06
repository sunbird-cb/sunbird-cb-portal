import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { CompetencyCardDetailsComponent } from './competency-card-details.component'

describe('CompetencyCardDetailsComponent', () => {
  let component: CompetencyCardDetailsComponent
  let fixture: ComponentFixture<CompetencyCardDetailsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompetencyCardDetailsComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetencyCardDetailsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
