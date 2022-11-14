import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { CuratedCollectionCardComponent } from './curated-collection-card.component'

describe('CuratedCollectionCardComponent', () => {
  let component: CuratedCollectionCardComponent
  let fixture: ComponentFixture<CuratedCollectionCardComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CuratedCollectionCardComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CuratedCollectionCardComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
