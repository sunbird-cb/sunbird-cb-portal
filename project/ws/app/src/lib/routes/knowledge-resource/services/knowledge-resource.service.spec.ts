import { TestBed } from '@angular/core/testing'

import { KnowledgeResourceService } from './knowledge-resource.service'

describe('KnowledgeResourceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: KnowledgeResourceService = TestBed.get(KnowledgeResourceService)
    expect(service).toBeTruthy()
  })
})
