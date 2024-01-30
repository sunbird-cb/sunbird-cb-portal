import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ContentSharingDialogComponent } from './content-sharing-dialog.component'

describe('ContentSharingDialogComponent', () => {
  let component: ContentSharingDialogComponent
  let fixture: ComponentFixture<ContentSharingDialogComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContentSharingDialogComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentSharingDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
