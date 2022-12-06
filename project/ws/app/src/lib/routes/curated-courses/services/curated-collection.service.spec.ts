import { TestBed } from '@angular/core/testing'

import { CuratedCollectionService } from './curated-collection.service'

describe('CuratedCollectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: CuratedCollectionService = TestBed.get(CuratedCollectionService)
    expect(service).toBeTruthy()
  })
})
