import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { RolesActivitiesComponent } from './roles-activities.component'

describe('RolesActivitiesComponent', () => {
  let component: RolesActivitiesComponent
  let fixture: ComponentFixture<RolesActivitiesComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolesActivitiesComponent ]
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(RolesActivitiesComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
