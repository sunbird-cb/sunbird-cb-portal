import { TestBed } from '@angular/core/testing'

import { ConfigResolverService } from './config-resolver.service'

describe('ConfigResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: ConfigResolverService = TestBed.get(ConfigResolverService)
    expect(service).toBeTruthy()
  })
})
