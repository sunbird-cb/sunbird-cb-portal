import { TestBed } from '@angular/core/testing'

import { NationalLearningConfigService } from './national-learning-config.service'

describe('NationalLearningConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: NationalLearningConfigService = TestBed.get(NationalLearningConfigService)
    expect(service).toBeTruthy()
  })
})
