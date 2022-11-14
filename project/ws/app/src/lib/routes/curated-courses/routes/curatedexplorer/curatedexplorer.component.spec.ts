import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { CuratedexplorerComponent } from './curatedexplorer.component'

describe('CuratedexplorerComponent', () => {
  let component: CuratedexplorerComponent
  let fixture: ComponentFixture<CuratedexplorerComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CuratedexplorerComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CuratedexplorerComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
