import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { ProfileCardStatsComponent } from './profile-card-stats.component'

describe('ProfileCardStatsComponent', () => {
  let component: ProfileCardStatsComponent
  let fixture: ComponentFixture<ProfileCardStatsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileCardStatsComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileCardStatsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
