import { TestBed } from '@angular/core/testing'

import { AppTocCiosResolverService } from './app-toc-cios-resolver.service'

describe('AppTocCiosResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: AppTocCiosResolverService = TestBed.get(AppTocCiosResolverService)
    expect(service).toBeTruthy()
  })
})
