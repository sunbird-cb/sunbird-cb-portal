import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { KarmaPointsComponent } from './karma-points.component'

describe('KarmaPointsComponent', () => {
  let component: KarmaPointsComponent
  let fixture: ComponentFixture<KarmaPointsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KarmaPointsComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(KarmaPointsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
