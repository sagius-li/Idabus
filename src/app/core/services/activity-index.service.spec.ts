import { TestBed } from '@angular/core/testing';

import { ActivityIndexService } from './activity-index.service';

describe('ActivityIndexService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ActivityIndexService = TestBed.get(ActivityIndexService);
    expect(service).toBeTruthy();
  });
});
