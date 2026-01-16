import { TestBed } from '@angular/core/testing';

import { FormDataResolverService } from './form-data-resolver.service';

describe('FormDataResolverService', () => {
  let service: FormDataResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormDataResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
