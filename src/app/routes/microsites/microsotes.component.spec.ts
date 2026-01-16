import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { MicrosotesComponent } from './microsotes.component'

describe('MicrosotesComponent', () => {
  let component: MicrosotesComponent
  let fixture: ComponentFixture<MicrosotesComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MicrosotesComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(MicrosotesComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
