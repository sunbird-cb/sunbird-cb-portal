import { TestBed } from '@angular/core/testing'

import { KarmaProgramsFormV1Service } from './karma-programs-form-v1.service'

describe('KarmaProgramsFormV1Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: KarmaProgramsFormV1Service = TestBed.get(KarmaProgramsFormV1Service)
    expect(service).toBeTruthy()
  })
})
