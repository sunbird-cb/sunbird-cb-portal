import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { PlayerOfflineSessionComponent } from './player-offline-session.component'

describe('PlayerOfflineSessionComponent', () => {
  let component: PlayerOfflineSessionComponent
  let fixture: ComponentFixture<PlayerOfflineSessionComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerOfflineSessionComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerOfflineSessionComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
