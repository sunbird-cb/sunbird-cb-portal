import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { JanKarmayogiHomeComponent } from './jan-karmayogi-home.component'

describe('JanKarmayogiHomeComponent', () => {
  let component: JanKarmayogiHomeComponent
  let fixture: ComponentFixture<JanKarmayogiHomeComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [JanKarmayogiHomeComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(JanKarmayogiHomeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
