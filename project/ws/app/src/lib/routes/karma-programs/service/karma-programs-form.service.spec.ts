import { TestBed } from '@angular/core/testing'

import { KarmaProgramsFormService } from './karma-programs-form.service'

describe('KarmaProgramsFormService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: KarmaProgramsFormService = TestBed.get(KarmaProgramsFormService)
    expect(service).toBeTruthy()
  })
})
