import { TestBed } from '@angular/core/testing';

import { OrganizerService } from '../services/organizer.service';

describe('OrganizerService', () => {
  let service: OrganizerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrganizerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
