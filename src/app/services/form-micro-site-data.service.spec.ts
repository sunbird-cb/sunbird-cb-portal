import { TestBed } from '@angular/core/testing';

import { FormMicroSiteDataService } from './form-micro-site-data.service';

describe('FormMicroSiteDataService', () => {
  let service: FormMicroSiteDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormMicroSiteDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
