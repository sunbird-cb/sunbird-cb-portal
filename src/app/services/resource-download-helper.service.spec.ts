import { TestBed } from '@angular/core/testing';

import { ResourceDownloadHelperService } from './resource-download-helper.service';

describe('ResourceDownloadHelperService', () => {
  let service: ResourceDownloadHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResourceDownloadHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
