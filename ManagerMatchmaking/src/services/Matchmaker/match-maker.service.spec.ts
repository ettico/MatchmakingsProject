import { TestBed } from '@angular/core/testing';

import { MatchMakerService } from './match-maker.service';

describe('MatchMakerService', () => {
  let service: MatchMakerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatchMakerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
