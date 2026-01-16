import { TestBed } from '@angular/core/testing';

import { CustomHomeFormResolverService } from './custom-home-form-resolver.service';

describe('CustomHomeFormResolverService', () => {
  let service: CustomHomeFormResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomHomeFormResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
