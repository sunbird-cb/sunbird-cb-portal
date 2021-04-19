import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { OrgUserTableComponent } from './org-user-table.component'

describe('OrgUserTableComponent', () => {
  let component: OrgUserTableComponent
  let fixture: ComponentFixture<OrgUserTableComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrgUserTableComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgUserTableComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
