import { TestBed } from '@angular/core/testing'

import { ContentReadResolverService } from './content-read-resolver.service'

describe('ContentReadResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: ContentReadResolverService = TestBed.get(ContentReadResolverService)
    expect(service).toBeTruthy()
  })
})
