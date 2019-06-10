import { TestBed } from '@angular/core/testing';

import { ComponentIndexService } from './component-index.service';

describe('ComponentIndexService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ComponentIndexService = TestBed.get(ComponentIndexService);
    expect(service).toBeTruthy();
  });
});
