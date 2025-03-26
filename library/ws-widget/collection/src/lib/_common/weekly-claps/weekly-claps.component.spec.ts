import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { WeeklyClapsComponent } from './weekly-claps.component'

describe('WeeklyClapsComponent', () => {
  let component: WeeklyClapsComponent
  let fixture: ComponentFixture<WeeklyClapsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WeeklyClapsComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyClapsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
