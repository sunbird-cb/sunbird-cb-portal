import { TestBed } from '@angular/core/testing'

import { KarmaProgramDataService } from './karma-program-data.service'

describe('KarmaProgramDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: KarmaProgramDataService = TestBed.get(KarmaProgramDataService)
    expect(service).toBeTruthy()
  })
})
