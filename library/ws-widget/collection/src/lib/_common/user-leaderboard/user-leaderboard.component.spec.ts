import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { UserLeaderboardComponent } from './user-leaderboard.component'

describe('UserLeaderboardComponent', () => {
  let component: UserLeaderboardComponent
  let fixture: ComponentFixture<UserLeaderboardComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserLeaderboardComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLeaderboardComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
