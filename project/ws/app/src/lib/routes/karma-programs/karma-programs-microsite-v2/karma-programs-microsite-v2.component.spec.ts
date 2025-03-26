import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { KarmaProgramsMicrositeV2Component } from './karma-programs-microsite-v2.component'

describe('KarmaProgramsMicrositeV2Component', () => {
  let component: KarmaProgramsMicrositeV2Component
  let fixture: ComponentFixture<KarmaProgramsMicrositeV2Component>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KarmaProgramsMicrositeV2Component],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(KarmaProgramsMicrositeV2Component)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
