import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { AppTocReferenceNotesComponent } from './app-toc-reference-notes.component'

describe('AppTocReferenceNotesComponent', () => {
  let component: AppTocReferenceNotesComponent
  let fixture: ComponentFixture<AppTocReferenceNotesComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppTocReferenceNotesComponent],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTocReferenceNotesComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
