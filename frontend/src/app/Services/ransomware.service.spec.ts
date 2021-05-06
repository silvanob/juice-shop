import { TestBed } from '@angular/core/testing';

import { RansomwareService } from './ransomware.service';

describe('RansomwareService', () => {
  let service: RansomwareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RansomwareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
