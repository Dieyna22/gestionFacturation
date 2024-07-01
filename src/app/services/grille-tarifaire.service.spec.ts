import { TestBed } from '@angular/core/testing';

import { GrilleTarifaireService } from './grille-tarifaire.service';

describe('GrilleTarifaireService', () => {
  let service: GrilleTarifaireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GrilleTarifaireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
