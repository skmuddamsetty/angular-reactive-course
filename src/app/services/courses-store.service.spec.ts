import { TestBed } from '@angular/core/testing';

import { CoursesStoreService } from './courses-store.service';

describe('CoursesStoreService', () => {
  let service: CoursesStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoursesStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
