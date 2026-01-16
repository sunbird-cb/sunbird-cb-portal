import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { OfflineSessionComponent } from './offline-session.component'

describe('OfflineSessionComponent', () => {
  let component: OfflineSessionComponent
  let fixture: ComponentFixture<OfflineSessionComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OfflineSessionComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineSessionComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
