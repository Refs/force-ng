import { TestBed } from '@angular/core/testing';

import { ForceService } from './force.service';

describe('ForceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ForceService = TestBed.get(ForceService);
    expect(service).toBeTruthy();
  });
});
