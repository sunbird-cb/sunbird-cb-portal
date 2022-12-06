import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { CuratedHomeComponent } from './curated-home.component'

describe('CuratedHomeComponent', () => {
  let component: CuratedHomeComponent
  let fixture: ComponentFixture<CuratedHomeComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CuratedHomeComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CuratedHomeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
