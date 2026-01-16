import { TestBed } from '@angular/core/testing';

import { SamuhikCharchaService } from './samuhik-charcha.service';

describe('SamuhikCharchaService', () => {
  let service: SamuhikCharchaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SamuhikCharchaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
