import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { KarmaProgramsMicrositeV1Component } from './karma-programs-microsite-v1.component'

describe('KarmaProgramsMicrositeV1Component', () => {
  let component: KarmaProgramsMicrositeV1Component
  let fixture: ComponentFixture<KarmaProgramsMicrositeV1Component>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KarmaProgramsMicrositeV1Component],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(KarmaProgramsMicrositeV1Component)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
