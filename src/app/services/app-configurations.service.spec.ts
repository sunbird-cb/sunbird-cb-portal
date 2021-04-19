import { TestBed } from '@angular/core/testing'

import { AppConfigurationsService } from './app-configurations.service'

describe('AppConfigurationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: AppConfigurationsService = TestBed.get(AppConfigurationsService)
    expect(service).toBeTruthy()
  })
})
