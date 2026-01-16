import { TestBed } from '@angular/core/testing'

import { AppHomePageResolverService } from './app-home-page-resolver.service'

describe('AppHomePageResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: AppHomePageResolverService = TestBed.get(AppHomePageResolverService)
    expect(service).toBeTruthy()
  })
})
