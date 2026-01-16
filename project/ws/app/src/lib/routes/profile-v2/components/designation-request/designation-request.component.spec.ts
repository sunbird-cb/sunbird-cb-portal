import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { DesignationRequestComponent } from './designation-request.component'

describe('DesignationRequestComponent', () => {
  let component: DesignationRequestComponent
  let fixture: ComponentFixture<DesignationRequestComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DesignationRequestComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignationRequestComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
