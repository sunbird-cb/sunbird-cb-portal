import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { CompetencySearchComponent } from './competency-search.component'

describe('CompetencySearchComponent', () => {
  let component: CompetencySearchComponent
  let fixture: ComponentFixture<CompetencySearchComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompetencySearchComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetencySearchComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
