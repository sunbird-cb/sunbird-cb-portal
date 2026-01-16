import { TestBed } from '@angular/core/testing'

import { JanKarmayogiService } from './jan-karmayogi.service'

describe('JanKarmayogiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: JanKarmayogiService = TestBed.get(JanKarmayogiService)
    expect(service).toBeTruthy()
  })
})
