import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { GyaanYoutubeComponent } from './gyaan-youtube.component'

describe('GyaanYoutubeComponent', () => {
  let component: GyaanYoutubeComponent
  let fixture: ComponentFixture<GyaanYoutubeComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GyaanYoutubeComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(GyaanYoutubeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
