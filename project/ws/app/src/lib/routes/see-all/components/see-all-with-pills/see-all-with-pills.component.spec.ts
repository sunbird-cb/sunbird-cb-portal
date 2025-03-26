import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { SeeAllWithPillsComponent } from './see-all-with-pills.component'

describe('SeeAllWithPillsComponent', () => {
  let component: SeeAllWithPillsComponent
  let fixture: ComponentFixture<SeeAllWithPillsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SeeAllWithPillsComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SeeAllWithPillsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
