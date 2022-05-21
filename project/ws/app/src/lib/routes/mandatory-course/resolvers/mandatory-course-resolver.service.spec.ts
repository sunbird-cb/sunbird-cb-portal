import { TestBed } from '@angular/core/testing'

import { MandatoryCourseResolverService } from './mandatory-course-resolver.service'

describe('MandatoryCourseResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: MandatoryCourseResolverService = TestBed.get(MandatoryCourseResolverService)
    expect(service).toBeTruthy()
  })
})
