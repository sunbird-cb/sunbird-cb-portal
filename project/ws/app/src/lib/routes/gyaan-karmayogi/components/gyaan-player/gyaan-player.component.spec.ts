import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { GyaanPlayerComponent } from './gyaan-player.component'

describe('GyaanPlayerComponent', () => {
  let component: GyaanPlayerComponent
  let fixture: ComponentFixture<GyaanPlayerComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GyaanPlayerComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(GyaanPlayerComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
