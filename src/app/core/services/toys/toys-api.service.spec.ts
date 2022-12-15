import { TestBed } from '@angular/core/testing';

import { ToysApiService } from './toys-api.service';

describe('ToysApiService', () => {
  let service: ToysApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToysApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
