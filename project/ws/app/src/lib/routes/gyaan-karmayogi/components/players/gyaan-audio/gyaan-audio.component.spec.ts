import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { GyaanAudioComponent } from './gyaan-audio.component'

describe('GyaanAudioComponent', () => {
  let component: GyaanAudioComponent
  let fixture: ComponentFixture<GyaanAudioComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GyaanAudioComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(GyaanAudioComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
