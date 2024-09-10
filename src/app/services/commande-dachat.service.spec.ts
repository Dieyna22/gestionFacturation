import { TestBed } from '@angular/core/testing';

import { CommandeDachatService } from './commande-dachat.service';

describe('CommandeDachatService', () => {
  let service: CommandeDachatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommandeDachatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
