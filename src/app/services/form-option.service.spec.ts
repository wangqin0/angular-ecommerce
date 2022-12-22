import { TestBed } from '@angular/core/testing';

import { FormOptionService } from './form-option.service';

describe('FormOptionService', () => {
  let service: FormOptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormOptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
