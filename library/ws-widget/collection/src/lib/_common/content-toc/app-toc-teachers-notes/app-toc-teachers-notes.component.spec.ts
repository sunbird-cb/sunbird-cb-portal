import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { AppTocTeachersNotesComponent } from './app-toc-teachers-notes.component'

describe('AppTocTeachersNotesComponent', () => {
  let component: AppTocTeachersNotesComponent
  let fixture: ComponentFixture<AppTocTeachersNotesComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppTocTeachersNotesComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTocTeachersNotesComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
