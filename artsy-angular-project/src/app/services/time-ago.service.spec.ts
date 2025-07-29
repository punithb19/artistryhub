import { TestBed } from '@angular/core/testing';

import { TimeAgoService } from './time-ago.service';

describe('TimeAgoService', () => {
  let service: TimeAgoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeAgoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
