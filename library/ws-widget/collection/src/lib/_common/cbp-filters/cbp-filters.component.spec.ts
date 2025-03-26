import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { CbpFiltersComponent } from './cbp-filters.component'

describe('CbpFiltersComponent', () => {
  let component: CbpFiltersComponent
  let fixture: ComponentFixture<CbpFiltersComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CbpFiltersComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CbpFiltersComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
