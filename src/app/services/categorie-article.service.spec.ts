import { TestBed } from '@angular/core/testing';

import { CategorieArticleService } from './categorie-article.service';

describe('CategorieArticleService', () => {
  let service: CategorieArticleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategorieArticleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
