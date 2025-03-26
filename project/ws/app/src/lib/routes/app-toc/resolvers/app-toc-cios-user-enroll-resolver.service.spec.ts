import { TestBed } from '@angular/core/testing'

import { AppTocCiosUserEnrollResolverService } from './app-toc-cios-user-enroll-resolver.service'

describe('AppTocCiosUserEnrollResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: AppTocCiosUserEnrollResolverService = TestBed.get(AppTocCiosUserEnrollResolverService)
    expect(service).toBeTruthy()
  })
})
