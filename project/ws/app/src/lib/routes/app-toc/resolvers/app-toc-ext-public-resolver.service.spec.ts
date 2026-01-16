import { TestBed } from '@angular/core/testing'

import { AppTocExtPublicResolverService } from './app-toc-ext-public-resolver.service'

describe('AppTocCiosResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: AppTocExtPublicResolverService = TestBed.get(AppTocExtPublicResolverService)
    expect(service).toBeTruthy()
  })
})
