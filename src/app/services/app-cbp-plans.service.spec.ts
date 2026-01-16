import { TestBed } from '@angular/core/testing'
import { AppCbpPlansService } from './app-cbp-plans.service'

describe('AppCbpPlansService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: AppCbpPlansService = TestBed.get(AppCbpPlansService)
    expect(service).toBeTruthy()
  })
})
