import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { KarmaProgramsMicrositeComponent } from './karma-programs-microsite.component'

describe('KarmaProgramsMicrositeComponent', () => {
  let component: KarmaProgramsMicrositeComponent
  let fixture: ComponentFixture<KarmaProgramsMicrositeComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KarmaProgramsMicrositeComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(KarmaProgramsMicrositeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
