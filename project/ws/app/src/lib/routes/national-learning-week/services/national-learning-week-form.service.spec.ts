import { TestBed } from '@angular/core/testing'

import { NationalLearningWeekFormService } from './national-learning-week-form.service'

describe('NationalLearningWeekFormService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: NationalLearningWeekFormService = TestBed.get(NationalLearningWeekFormService)
    expect(service).toBeTruthy()
  })
})
