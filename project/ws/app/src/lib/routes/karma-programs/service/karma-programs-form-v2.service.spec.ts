import { TestBed } from '@angular/core/testing'
import { KarmaProgramsFormV2Service } from './karma-programs-form-v2.service.'

describe('KarmaProgramsFormV2Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: KarmaProgramsFormV2Service = TestBed.get(KarmaProgramsFormV2Service)
    expect(service).toBeTruthy()
  })
})
